pmux_logview.detail = {
    parent:                            pmux_logview,
    reload_job_log_detail_initialized: false,
    job_log_detail_ajax_requested:     false,
    need_reload_job_log_detail:        true,
    reload_job_log_detail_timer_id:    null,
    draw_invoke_timer_id:              null,
    $detail_body:                      null,
    $detail_chart_header:              null,
    $detail_chart_tchart:              null,
    $reload_button:                    null,
    $user_name:                        null,
    ajax_data:                         null
};

pmux_logview.detail.get_job_id = function() {
    return this.$detail_body.attr("data-job-id");
};

pmux_logview.detail.draw_detail_job_chat = function() {
    if (this.ajax_data == null) {
        return;
    }
    var data = this.ajax_data;
    var base_time = null;
    var table_html = '<table class="border" width=" ' + ($(window).innerWidth() - 50) + ';"><thead></thead><tbody><tr>';
    if (data.length >= 1) {
        // save started time
        base_time = Number(data[0]["job_started_at_msec"])
        // create html
        for (data_key in data[0]) {
            if (data_key == "params") {
                var cnt = 0;
                var params_html = "";
                for (params_key in data[0][data_key]) {
                    params_html += '<td class="border">' + params_key + '</td>';
                    params_html += '<td class="border">' + this.parent.html_escape(data[0][data_key][params_key]) + '</td>';
                    params_html += '</tr><tr>'
                    cnt += 1;
                }
                table_html += '<td class="border" rowspan="' + cnt + '">' + data_key + '</td>' + params_html;
            } else {
                table_html += '<td class="border" colspan="2">' + data_key  + '</td>';
                table_html += '<td class="border">' +  this.parent.html_escape(data[0][data_key])  + '</td>';
                table_html += '</tr><tr>';
            }
        }
    }
    if (data.length >= 3) {
        if ("job_finished_at" in data[2] || "error_status" in  data[2]) {
           this.parent.update_reload_button();
        }
        for (data_key in data[2]) {
            table_html += '<td class="border" colspan="2">' + data_key  + '</td>';
            table_html += '<td class="border">' + this.parent.html_escape(data[2][data_key]) + '</td>';
            table_html += '</tr><tr>';
        }
    }
    table_html += '</tr></tbody></table>';
    this.$detail_chart_header.html(table_html);
    // chart
    if (data.length >= 2) {
        // convert tchart format
        var source = {
            settings: {
                width: $(window).innerWidth() - 50
            },
            actors : {},
            tasks : {}
        };
        for (data_key in data[1]) {
            data[1][data_key].task_id = data_key;
            var from = base_time + Math.floor(parseFloat(data[1][data_key].allocated_at) * 1000);
            var to = from + Math.floor(parseFloat(data[1][data_key].elapse) * 1000);
            source.tasks[data_key] = {
                name: "task " + data_key,
                from: from,
                to: to,
                clickEventArg: data[1][data_key],
                nextTasks: null
            }
            if (!(data[1][data_key].node_addr in source.actors)) {
                source.actors[data[1][data_key].node_addr] = {
                    name: data[1][data_key].node_addr,
                    tasks: []
                };
            }
            source.actors[data[1][data_key].node_addr].tasks.push(data_key);
        }
        this.$detail_chart_tchart.tchart('update', source);
    } else {
        this.$detail_chart_tchart.tchart('remove');
    }
}

pmux_logview.detail.reload_job_log_detail = function() {
    if (!this.parent.can_reload) {
        return;
    }
    if (this.job_log_detail_ajax_requested) {
        return 
    }
    var self = this;
    var url = "log/job/" + this.get_job_id() + "/detail";
    this.parent.ajax_base(url, "GET", {}).done(function(data, textStatus, XMLHttpRequest) {
        self.ajax_data = data;
        self.draw_detail_job_chat();
        self.parent.activityOff(null);
        self.job_log_detail_ajax_requested = false;
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
        self.parent.open_dialog("job log の読み込みに失敗しました。");
        self.parent.activityOff(null);
        self.job_log_detail_ajax_requested = false;
    });
    this.job_log_detail_ajax_requested = true;
};

pmux_logview.detail.reload = function() {
    var self = this;
    if (this.need_reload_job_log_detail) {
        if (this.reload_job_log_detail_timer_id == null) {
            this.reload_job_log_detail_timer_id = setInterval(function(){
                self.reload_job_log_detail(); 
            }, 3000);
        }
        if (!this.reload_job_log_detail_initialized) {
            self.parent.activityOn(null);
            this.reload_job_log_detail();
            this.reload_job_log_detail_initialized = true;
        } 
    } else {
        if (this.reload_job_log_detail_timer_id != null) {
            clearInterval(this.reload_job_log_detail_timer_id);
            this.reload_job_log_detail_timer_id = null;
        } 
    }
};

pmux_logview.detail.draw_invoke = function() {
    if (this.ajax_data != null) {
        this.draw_detail_job_chat();
    } 
    if (this.draw_invoke_timer_id != null) {
        clearInterval(this.draw_invoke_timer_id);
        this.draw_invoke_timer_id = null;
    }
}

pmux_logview.detail.initialize = function() {
    var self = this;
    this.parent.initialize();
    this.$user_name = $("#user-name");
    this.$reload_button = $("#reload-button").click(function () {
                               self.update_reload_button();
                          });
    this.$detail_body = $("#detail-body");
    this.$detail_chart_header = $("#detail-chart-header");
    this.$detail_chart_tchart = $("#detail-chart-tchart").tchart({
                                    onTaskClick: function(task, target, event) {
                                        var html = '<table class="border task-tooltip"><thead class="task-tooltip"></thead>';
                                        html += '<tbody class="task-tooltip"><tr class="task-tooltip">';
                                        for (key in task) {
                                            html += '<td class="task-tooltip">' + key +'</td>';
                                            html += '<td class="task-tooltip">' + task[key] +'</td></tr><tr class="task-tooltip">'; 
                                        }
                                        html += '</tr></tbody></table>';
                                        self.parent.open_tooltip(html, target, event);
                                     }
                                 });
    $(window).resize(function() {
        if (self.draw_invoke_timer_id == null) {
            self.draw_invoke_timer_id = setInterval(function() { self.draw_invoke() }, 1000);
        }
    });
    this.reload();
};

$(document).ready(function(){
    pmux_logview.detail.initialize();
});

