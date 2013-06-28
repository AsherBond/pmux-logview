var pmux_logview = {
    can_reload:      true,
    $user_name:      null,
    $reload_button:  null,
    $indicator:      null,
    $dialog_message: null,
    $dialog:         null,
    $task_tooltip:   null
};

pmux_logview.ajax_base = function(url, method, param) {
    return $.ajax({
        type: method,
        url: url,
        dataType: 'json',
        data: param,
        contentType: 'application/json',
        cache: false
    });
};

pmux_logview.html_escape = function(text) {
    var dummy = document.createElement('div'); 
    return $(dummy).text(text).html().replace(/"/g, "&quot;")
};

pmux_logview.get_user_name = function() {
    return this.$user_name.text();
};

pmux_logview.activityOn = function(callback) {
    this.$indicator.activity();
    if (callback) {
        callback();
    }
};

pmux_logview.activityOff = function(callback) {
    this.$indicator.activity(false);
    if (callback) {
        callback();
    }
};

pmux_logview.update_reload_button = function() {
    var button_body = "";  
    if (this.can_reload) {
        this.can_reload = false;
        button_body += '<span class="icon-space">リロードの開始</span>';
        button_body += '<span class="button-icon-adjust ui-icon ui-icon-play"></span>';
    } else {
        this.can_reload = true;
        button_body += '<span class="icon-space">リロードの停止</span>';
        button_body += '<span class="button-icon-adjust ui-icon ui-icon-stop"></span>';
    }
    this.$reload_button.html(button_body);
};

pmux_logview.open_tooltip = function(html, target, event) {
    var $target = $(target);
    base_height = $target.attr("height");
    if (base_height == undefined) {
        base_height = 0;
    }
    var target_height = (base_height);
    this.$task_tooltip.html(html).show();
    var doc_height = this.$task_tooltip.outerHeight();
    var doc_width = this.$task_tooltip.outerWidth();
    var window_width = $(window).innerWidth();
    var x_adjust = 0
    if (event.pageX + doc_width > window_width) {
        x_adjust = event.pageX + doc_width - window_width + 4;
    }
    var base_x = event.layerX;
    var base_y = event.layerY;
    if (base_x == undefined) {
        base_x = event.pageX;
        base_y = event.pageY - 100; // offset
    }
    this.$task_tooltip.css("top", base_y - target_height - doc_height).css("left", base_x - x_adjust);
};

pmux_logview.open_dialog = function(html) {
    this.$dialog_message.html(html);
    this.$dialog.dialog("open");
};

pmux_logview.initialize = function() {
    var self = this;
    this.$user_name = $("#user-name");
    this.$reload_button = $("#reload-button").click(function () {
                              self.update_reload_button();
                          });
    this.$task_tooltip = $("#task-tooltip").hide();
    this.$task_tooltip.dblclick(function(e) {
        $(this).hide();
    });
    $("body").click(function(e) {
        var $target = $(e.target);
        var target_class = $target.attr("class");
        if (target_class != "actorsSwimlaneChartTaskRect" &&
            target_class != "tasksGanttChartTaskRect" &&
            target_class != "tasksBarChartTaskRect" &&
            !$target.hasClass("task-tooltip") &&
            !$target.hasClass("error-info")) {
            self.$task_tooltip.hide();
        }
    });
    this.$indicator = $("#indicator");
    this.$dialog = $("#dialog").dialog({ autoOpen: false,
                                         position: ["center", "center"],
                                         title: "警告メッセージ",
                                         buttons: [{ text: "OK",
                                                     click: function() { $(this).dialog("close"); } }]
                        });
    this.$dialog_message = $("#dialog-message");
};
