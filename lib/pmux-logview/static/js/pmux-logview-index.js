pmux_logview.index = {
    parent:                            pmux_logview,
    job_log_sort_keys:                 [ "job_id", "mapper", "start_time", "end_time", "elapsed_time" ],
    job_log_sort_key:                  "start_time",
    job_log_sort_order:                "desc",
    job_log_nitems:                    20,
    job_log_page:                      0,
    job_log_jobs:                      {},
    job_log_jobs_cookie:               0,
    reload_job_log_type:               "archive",
    reload_job_log_initialized:        false,
    reload_dispatcher_log_initialized: false,
    job_log_ajax_requested:            false,
    dispatcher_log_ajax_requested:     false,
    need_reload_job_log:               true,
    need_reload_dispatcher_log:        false,
    reload_job_log_timer_id:           null,
    reload_dispatcher_log_timer_id:    null,
    draw_invoke_timer_id:              null,
    tab_active_index:                  0,
    selected_job_id:                   null,
    $main_tab:                         null,
    $job_log_table:                    null,
    $dispatcher_log_table:             null,
    $more_button:                      null,
    $job_chart_tchart:                 null,
    max_mapper_length:                 35
};

pmux_logview.index.draw_job_chart = function() {
    // convert tchart format
    var source = {
       settings: {
           drawActorsSwimlaneChart: false,
           width: $(window).innerWidth() - 80,
           tasksGanttChart : {
               label: "jobs gantt chart"
           },
           tasksBarChart : {
               label: "jobs bar chart"
           }
       },
       actors : null,
       tasks : {}
    };
    var job_count = 0;
    for (job_id in this.job_log_jobs) {
        var from = Number(this.job_log_jobs[job_id].start_time_msec);
        var to;
        if ("end_time_msec" in this.job_log_jobs[job_id]) {
            to = Number(this.job_log_jobs[job_id].end_time_msec);
        } else {
            continue;
        }
        source.tasks[job_id] = {
            name: "id " + job_id,
            from: from,
            to: to,
            clickEventArg: this.job_log_jobs[job_id],
            nextTasks: null
        }
        job_count += 1;
    }
    if (job_count != 0) {
        this.$job_chart_tchart.tchart('update', source);
    }
}

pmux_logview.index.open_detail = function(job_id) {
    window.open("detail?job_id=" + job_id, "_blank");
};

pmux_logview.index.update_progress_bar = function() {
    $(".progress-bar").each(function() {
        var $target = $(this);
        var data_value =  $target.attr("data-value");
        $target.progressbar({value: Number(data_value)});
    });
};

pmux_logview.index.reload_job_log = function(force) {
    if (!this.parent.can_reload) {
        return;
    }
    if (!force && this.job_log_ajax_requested) {
        return;
    }
    var self = this;
    var param = { sort_key: this.job_log_sort_key,
                  sort_order: this.job_log_sort_order,
                  type: this.reload_job_log_type,
                  nitems: this.job_log_nitems,
                  page: this.job_log_page,
                  jobs_cookie: this.job_log_jobs_cookie };
    this.parent.ajax_base("log/job", "GET", param).done(function(data, textStatus, XMLHttpRequest) {
        if (!("jobs_cookie" in data && "jobs" in data)) {
             self.$job_log_table.fnClearTable();
             self.$job_log_table.fnAddData(["invalid response", "", "", "", ""]);
             self.parent.activityOff(function(){ self.$main_tab.tabs("option", "disabled", false) });
             return;
        }
        $.extend(true, self.job_log_jobs, data.jobs);
        self.job_log_jobs_cookie = data.jobs_cookie;
        self.$job_log_table.fnClearTable();
        var sorted_jobs = [];
        for (var job_id in self.job_log_jobs) {
            if (self.$job_log_table.fnSettings().aaSorting.length == 0) {
                var inserted = false; 
                for (var i = 0; i < sorted_jobs.length; i++) {
                    if (Number(self.job_log_jobs[job_id]["start_time_msec"]) > Number(sorted_jobs[i]["start_time_msec"])) {
                        sorted_jobs.splice(i, 0, self.job_log_jobs[job_id]);
                        inserted = true;
                        break;
                    }
                }
                if (!inserted) {
                    sorted_jobs.push(self.job_log_jobs[job_id]);
                }
            } else {
                sorted_jobs.push(self.job_log_jobs[job_id]);
            }
        }
        var body_array = [];
        for (i = 0; i < sorted_jobs.length; i++) {
            var row_array = []
            var job_id_html = '';
            job_id_html += '<button class="detail-button container button-color button-normalize ui-corner-all" data-job-id="' + sorted_jobs[i]["job_id"] + '">';
            if ("error_status" in sorted_jobs[i]) {
                job_id_html += '    <span class="icon-space"><font color="red">' + sorted_jobs[i].job_id + '</font></span>';
            } else {
                job_id_html += '    <span class="icon-space">' + sorted_jobs[i].job_id + '</span>';
            }
            job_id_html += '    </span><span class="button-icon-adjust ui-icon ui-icon-info"></span>';
            job_id_html += '</button>';
            if ("error_status" in sorted_jobs[i]) {
                job_id_html += '<button class="error-button error-info button-color button-normalize ui-corner-all" data-error-status="' + sorted_jobs[i].error_status  + '" data-error-message="' +  self.parent.html_escape(sorted_jobs[i].error_message) + '">';
                job_id_html += '<div class="error-info ui-state-error"><span class="error-info ui-icon ui-icon-alert"></span></div>';
                job_id_html += '</button>';
            } 
            row_array.push(job_id_html)
            if (sorted_jobs[i].mapper && sorted_jobs[i].mapper.length > self.max_mapper_length) {
                row_array.push('<span class="text-ellipsis">'+ self.parent.html_escape(sorted_jobs[i].mapper.substring(0, self.max_mapper_length)) + '...</span>');
            } else {
                row_array.push('<span class="text-ellipsis">'+ self.parent.html_escape(sorted_jobs[i].mapper) + '</span>');
            }
            row_array.push('<span class="cell-nowrap">' + sorted_jobs[i].start_time + '</span>');
            if (sorted_jobs[i].end_time.match(/^\d+%$/)) {
                var percent = sorted_jobs[i].end_time.replace("%","");
                row_array.push('<span class="cell-nowrap"><div class="progress-bar" data-value="' + percent + '" ></div></span>');
            } else {
                row_array.push('<span class="cell-nowrap">' + sorted_jobs[i].end_time + '</span>');
            }
            row_array.push(sorted_jobs[i].elapsed_time);
            body_array.push(row_array);
        }
        self.$job_log_table.fnAddData(body_array);
        self.update_progress_bar();
        self.parent.activityOff(function(){ self.$main_tab.tabs("option", "disabled", false) });
        self.valid_last_job_id = true; 
        self.reload_job_log_type = "update";
        self.job_log_ajax_requested = false;
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
        self.parent.open_dialog("job log の読み込みに失敗しました。");
        self.parent.activityOff(function(){ self.$main_tab.tabs("option", "disabled", false) });
        self.job_log_ajax_requested = false;
    });
    self.job_log_ajax_requested = true;
};

pmux_logview.index.reload_dispatcher_log = function() {
    if (!this.parent.can_reload) {
        return;
    }
    if (this.dispatcher_log_ajax_requested) {
        return;
    }
    var self = this;
    this.parent.ajax_base("log/dispatcher", "GET", {}).done(function(data, textStatus, XMLHttpRequest) {
        self.$dispatcher_log_table.fnClearTable();
        var body_array = [];
        for (var i = data.length - 1; i >= 0; i--) {
            body_array.push([data[i]]);
        }
        self.$dispatcher_log_table.fnAddData(body_array);
        self.parent.activityOff(function(){ self.$main_tab.tabs("option", "disabled", false) });
        self.dispatcher_log_ajax_requested = false;
    }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
        self.parent.open_dialog("dispatcher log の読み込みに失敗しました。");
        self.parent.activityOff(function(){ self.$main_tab.tabs("option", "disabled", false) });
        self.dispatcher_log_ajax_requested = false;
    });
    this.dispatcher_log_ajax_requested = true;
};

pmux_logview.index.reload = function() {
    var self = this;
    if (this.need_reload_job_log) {
        if (this.reload_job_log_timer_id == null) {
            this.reload_job_log_timer_id = setInterval(function(){
                self.reload_job_log(false); 
            }, 3000);
        }
        if (!this.reload_job_log_initialized) {
            this.parent.activityOn(function(){ self.$main_tab.tabs("option", "disabled", true) });
            this.reload_job_log_type = "archive";
            this.reload_job_log(true);
            this.reload_job_log_initialized = true;
        } 
    } else {
        if (this.reload_job_log_timer_id != null) {
            clearInterval(this.reload_job_log_timer_id);
            this.reload_job_log_timer_id = null;
        } 
    }
    if (this.need_reload_dispatcher_log) {
        if (this.reload_dispatcher_log_timer_id == null) {
            this.reload_dispatcher_log_timer_id = setInterval(function(){
                self.reload_dispatcher_log(); 
            }, 3000);
        }
        if (!this.reload_dispatcher_log_initialized) {
            this.parent.activityOn(function(){ self.$main_tab.tabs("option", "disabled", true) });
            this.reload_dispatcher_log();
            this.reload_dispatcher_log_initialized = true;
        } 
    } else {
        if (this.reload_dispatcher_log_timer_id != null) {
            clearInterval(this.reload_dispatcher_log_timer_id);
            this.reload_dispatcher_log_timer_id = null;
        } 
    }
};

pmux_logview.index.draw_invoke = function() {
    if (this.tab_active_index == 2) {
        this.draw_job_chart();
    }
    if (this.draw_invoke_timer_id != null) {
        clearInterval(this.draw_invoke_timer_id);
        this.draw_invoke_timer_id = null;
    }
}

pmux_logview.index.initialize = function() {
    var self = this;
    this.parent.initialize();
    this.$main_tab = $("#main-tabs").tabs({
                         active: this.tab_active_index,
                         activate: function(event, ui) {
                             self.tab_active_index = self.$main_tab.tabs("option", "active");
                             if (self.tab_active_index == 0) { 
                                  self.need_reload_job_log = true;
                                  self.need_reload_dispatcher_log = false;
                             } else if (self.tab_active_index == 1) {
                                  self.need_reload_job_log = false;
                                  self.need_reload_dispatcher_log = true;
                             } else if (self.tab_active_index == 2) {
                                  self.draw_job_chart();
                             }
                             self.reload();
                         }
                     });
    this.$job_log_table = $("#job-log-table").dataTable({
                              aaSorting: [],
                              bPaginate: false,
                              bScrollCollapse: true,
                              bSort: true,
                              bFilter: true,
                              bJQueryUI: true,
                              bAutoWidth: true,
                              sPaginationType: "full_numbers",
                              fnRowCallback: function(nRow) {
                                  if (nRow.cells[0]) nRow.cells[0].noWrap = true;
                                  if (nRow.cells[1]) nRow.cells[1].noWrap = true;
                                  return nRow
                              },
                              fnDrawCallback: function() { 
                                  self.update_progress_bar();
                                  var $this = (this)
                                  if ($this.fnSettings().aaSorting.length  != 0) {
                                      var sort_key = self.job_log_sort_keys[$this.fnSettings().aaSorting[0][0]];
                                      var sort_order = $this.fnSettings().aaSorting[0][1];
                                      if (self.job_log_sort_key != sort_key || self.job_log_sort_order != sort_order) {
                                          self.job_log_sort_key = sort_key;
                                          self.job_log_sort_order = sort_order;
                                          self.job_log_page = 0;
                                          self.reload_job_log_type = "archive";
                                          self.reload_job_log(true);
                                      }
                                  }
                                  self.$error_button = $(".error-button").click(function(event) {
                                                           var html = '<table class="border task-tooltip"><thead class="task-tooltip"></thead>';
                                                           html += '<tbody class="task-tooltip"><tr class="task-tooltip">';
                                                           html += '<td class="task-tooltip">status:</td>';
                                                           html += '<td class="task-tooltip">' + $(event.currentTarget).attr("data-error-status") +'</td>';
                                                           html += '</tr><tr class="task-tooltip">';
                                                           html += '<td class="task-tooltip">message:</td>';
                                                           html += '<td class="task-tooltip">' + $(event.currentTarget).attr("data-error-message") +'</td>';
                                                           html += '</tr></tbody></table>';
                                                           self.parent.open_tooltip(html, event.target, event);
                                                       });
                                  self.$detail_button = $(".detail-button").click(function(event) {
                                                           self.open_detail($(event.currentTarget).attr("data-job-id"));
                                                       });
                              } 
                         });
    this.$dispatcher_log_table = $("#dispatcher-log-table").dataTable({
                                     aaSorting: [],
                                     bPaginate: false,
                                     bScrollCollapse: true,
                                     bSort: false,
                                     bFilter: true,
                                     bJQueryUI: true,
                                     bAutoWidth: true
                                 });
    this.$more_button = $("#more-button").click(function() {
                            self.job_log_page += 1;
                            self.reload_job_log_type = "archive";
                            self.parent.activityOn(function(){ self.$main_tab.tabs("option", "disabled", true) });
                            self.reload_job_log(true);
                        });
    this.$job_chart_tchart = $("#job-chart-tchart").tchart({
                                 onTaskClick: function(task, target, event) {
                                     var html = '<table class="border task-tooltip"><thead class="task-tooltip"></thead>';
                                     html += '<tbody class="task-tooltip"><tr class="task-tooltip">';
                                     for (key in task) {
                                         html += '<td class="task-tooltip">' + key +'</td>';
                                         if (key == "job_id") {
                                             html += '<td><button class="container button-color button-normalize ui-corner-all" onClick="pmux_logview.index.open_detail(\'' + task[key] + '\')">';
                                             html += '    <span class="icon-space">' + task[key] + '</span>';
                                             html += '    </span><span class="button-icon-adjust ui-icon ui-icon-info"></span>';
                                             html += '</button></td></tr><tr class="task-tooltip">';
                                         } else {
                                             html += '<td class="task-tooltip">' + task[key] +'</td></tr><tr class="task-tooltip">';
                                         }
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
    pmux_logview.index.initialize();
});

