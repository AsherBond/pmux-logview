(function($) {
    var _tcColorPattern = ['#990033','#ff0066','#cc00cc','#6600cc','#3333ff','#003366','#009999','#00ff99',
                           '#009933','#00cc00','#ccff00','#ffcc00','#996633','#cc9966','#ff3366','#ff3399',
                           '#cc00ff','#9966ff','#3333cc','#6699cc','#669999','#339966','#33ff66','#33ff00',
                           '#999900','#ffcc66','#330000','#ffcc99','#cc0033','#ff0099','#9900cc','#330066',
                           '#0066ff','#006699','#99cccc','#006633','#00ff66','#66ff00','#cccc00','#ffcc33',
                           '#663333','#ffffff','#ff0033','#ff33cc','#990099','#6600ff','#0033ff','#3399cc',
                           '#ccffff','#336633','#ccffcc','#99ff00','#cccc33','#cc9933','#996666','#cccccc',
                           '#ff9999','#ff00cc','#cc99cc','#6633ff','#3366ff','#0099cc','#33cccc','#669966',
                           '#ccff99','#66cc00','#333300','#996600','#cc9999','#999999','#cc3366','#ff66ff',
                           '#996699','#ccccff','#3366cc','#66ccff','#66cccc','#66cc66','#99ff66','#00ff00',
                           '#666600','#cc9900','#993333','#666666','#ffccff','#ff33ff','#663366','#9999ff',
                           '#000066','#3399ff','#339999','#99ff99','#99ff33','#33cc00','#999933','#ff9900',
                           '#cc6666','#333333','#cc6699','#ff00ff','#660099','#9999cc','#000033','#003399',
                           '#336666','#66ff66','#00ff33','#339900','#cccc66','#cc6600','#ffcccc','#993366',
                           '#cc0099','#9933cc','#6666cc','#0000ff','#0099ff','#006666','#339933','#33ff33',
                           '#99cc66','#666633','#993300','#ff3333','#660033','#990066','#660066','#6666ff',
                           '#000099','#33ccff','#003333','#99cc99','#00cc33','#669933','#999966','#cc6633',
                           '#cc3333','#cc3399','#cc66cc','#9900ff','#666699','#0033cc','#00ccff','#00ffcc',
                           '#66ff99','#33cc33','#99cc33','#cccc99','#663300','#ff6666','#ff99cc','#cc33cc',
                           '#9933ff','#333366','#0000cc','#99ffff','#33ffcc','#33ff99','#66ff33','#336600',
                           '#ffffcc','#ff9966','#660000','#ff66cc','#cc99ff','#9966cc','#333399','#336699',
                           '#66ffff','#33cc99','#33cc66','#009900','#669900','#ffff99','#ff6633','#990000',
                           '#ff99ff','#cc66ff','#330033','#330099','#0066cc','#33ffff','#00cc99','#00cc66',
                           '#66cc33','#99cc00','#ffff66','#ff9933','#cc0000','#ff6699','#cc33ff','#663399',
                           '#3300cc','#99ccff','#00ffff','#66ffcc','#66cc99','#006600','#ccff66','#ffff33',
                           '#ff6600','#ff0000','#cc0066','#993399','#6633cc','#3300ff','#6699ff','#00cccc',
                           '#99ffcc','#009966','#003300','#ccff33','#ffff00','#cc3300','#ff3300','#000000'];

    var _tcGetColor = function(pos) {
        var idx = pos % _tcColorPattern.length;
        return _tcColorPattern[idx];
    }

    var _tcGetStringLength = function(str) {
        len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) < 256) {
                len += 1;
            } else {
                len += 2;
            }
        }
        return len;
    }

    var _tcTFPad = function(v, len) {
        return ("000" + v).substr(-len);
    }

    var _tcTimestampFormat = function(value, BrushFromTo) {
        var differ = BrushFromTo[1] - BrushFromTo[0];
        var msec = value % 1000;  
        var dt = new Date(value);
        if (differ < 1000) { 
           // 1sec
           return "" + _tcTFPad(dt.getHours(), 2) + ":" + _tcTFPad(dt.getMinutes(), 2) + ":" + _tcTFPad(dt.getSeconds(), 2) + "." + _tcTFPad(msec, 3);
        } else if (differ < 60 * 1000) {
           // 1min
           return "" + _tcTFPad(dt.getHours(), 2) + ":" + _tcTFPad(dt.getMinutes(), 2) + ":" + _tcTFPad(dt.getSeconds(), 2) + "." + _tcTFPad(msec, 3);
        } else if (differ < 60 * 60 * 1000) {
           // 1hour
           return "" + _tcTFPad((dt.getMonth() + 1), 2) + "-" +  _tcTFPad(dt.getDate(), 2) + " " + _tcTFPad(dt.getHours(), 2) + ":" + _tcTFPad(dt.getMinutes(), 2) + ":" + _tcTFPad(dt.getSeconds(), 2);
        } else if (differ < 24 * 60 * 60 * 1000) {
           // 1day
           return "" + _tcTFPad(dt.getFullYear(), 4) + "-" + _tcTFPad((dt.getMonth() + 1), 2) + "-" +  _tcTFPad(dt.getDate(), 2) + " " + _tcTFPad(dt.getHours(), 2) + ":" + _tcTFPad(dt.getMinutes(), 2);
        } else if (differ < 7 * 24 * 60 * 60 * 1000) {
           // 1week
           return "" + _tcTFPad(dt.getFullYear(), 4) + "-" + _tcTFPad((dt.getMonth() + 1), 2) + "-" +  _tcTFPad(dt.getDate(), 2) + " " + _tcTFPad(dt.getHours(), 2) + ":" + _tcTFPad(dt.getMinutes(), 2);
        } else if (differ < 30 * 24 * 60 * 60 * 1000) {
           // 1month
           return "" + _tcTFPad(dt.getFullYear(), 4) + "-" + _tcTFPad((dt.getMonth() + 1), 2) + "-" +  _tcTFPad(dt.getDate(), 2); 
        } else {
           return "" + _tcTFPad(dt.getFullYear(), 4) + "-" + _tcTFPad((dt.getMonth() + 1), 2) + "-" +  _tcTFPad(dt.getDate(), 2); 
        }
    }

    var _tcElapsedTimeFormat = function(value, BrushFromTo) {
        var differ = BrushFromTo[1] - BrushFromTo[0];
        var dt = new Date(value);
        var week = Math.floor(value / (7 * 24 * 60 * 60 * 1000));
        value -= week * (7 * 24 * 60 * 60 * 1000);
        var day = Math.floor(value / (24 * 60 * 60 * 1000));
        value -= day * (24 * 60 * 60 * 1000);
        var hour = Math.floor(value / (60 * 60 * 1000));
        value -= hour * (60 * 60 * 1000);
        var min = Math.floor(value / (60 * 1000));
        value -= min * (60 * 1000);
        var sec = Math.floor(value / (1000));
        value -= sec * (1000);
        var msec = value;
        if (differ < 1000) { 
           // < 1sec
           return "" + msec + "ms";
        } else if (differ < 60 * 1000) {
           // < 1min
           return "" + sec + "s " + msec + "ms";
        } else if (differ < 60 * 60 * 1000) {
           // < 1hour
           return "" + min + "m " +  sec + "s ";
        } else if (differ < 24 * 60 * 60 * 1000) {
           // < 1day
           return "" + hour + "h " +  min + "m ";
        } else if (differ < 7 * 24 * 60 * 60 * 1000) {
           // < 1week
           return "" + day + "d " + hour + "h " +  min + "m ";
        } else  {
           // other
           return "" + week + "w " + day + "d " + hour + "h ";
        }
    }

    var _tcAdjustBlushValue = function(brushFrom, brushTo, start, end) {
        if (brushFrom == null ||
            brushTo == null) {
            brushFrom = start;
            brushTo = end;
        }
        if (brushFrom < start) {
            brushFrom = start;
        }
        if (brushTo > end) {
            brushTo = end;
        }
        if (brushTo == brushFrom) {
            brushFrom = start;
            brushTo = end;
        }
        return [brushFrom, brushTo];
    }

    var _tcGetBrushExtent = function(viewRange, start, end) {
        if (viewRange.from == null ||
            viewRange.to == null) {
            return [0, 0];
        } else {
            if (viewRange.from < start) {
                viewRange.from = start; 
            }
            if (viewRange.to > end) {
                viewRange.to = end;
            }
            return [viewRange.from, viewRange.to];
        }
    }
    var _tcGetCommonData = function(source) {
        var startDateMin = null;
        var endDateMax = null;
        var commonData = {}
        commonData.scrolls = [];
        commonData.tasks = [];
        commonData.containers = [ {cls: "scrollButtonsContainer"},
                                  {cls: "optionsContainer" } ];
        commonData.datePickerContainersData = [ {cls: "datePickerContainer startDatePickerContainer", label: "start :"},
                                                {cls: "datePickerContainer endDatePickerContainer", label: "end :"} ]
        commonData.datePickersData = [ {span: "span.startDatePickerContainer", data: [{ cls: "startDatePicker" }] },
                                       {span: "span.endDatePickerContainer", data: [{ cls: "endDatePicker" }] } ]
        if (source.actors != null) {
	    if (source.settings.drawActorsSummaryBarChart) {
                commonData.scrolls.push({target: "div.actorsSummaryBarChart", label: source.settings.actorsSummaryBarChart.label , cls: "tchartButton  ui-corner-all"});
	    } else if (source.settings.drawActorsSwimlaneChart) {
                commonData.scrolls.push({target: "div.actorsSwimlaneChart", label: source.settings.actorsSwimlaneChart.label , cls: "tchartButton  ui-corner-all"});
	    }
        }
        if (source.tasks != null) {
            commonData.scrolls.push({target: "div.tasksGanttChart", label: source.settings.tasksGanttChart.label, cls: "tchartButton  ui-corner-all"});
            commonData.scrolls.push({target: "div.tasksBarChart", label: source.settings.tasksBarChart.label, cls: "tchartButton  ui-corner-all"});
            var count = 0;
            for (var taskId in source.tasks) {
                if (startDateMin == null) {
                    startDateMin = source.tasks[taskId].from;
                } else {
                    if (source.tasks[taskId].from < startDateMin) {
                        startDateMin = source.tasks[taskId].from;
                    }
                }
                if (endDateMax == null) {
                    endDateMax = source.tasks[taskId].to;
                } else {
                    if (source.tasks[taskId].to > endDateMax) {
                        endDateMax = source.tasks[taskId].to;
                    }
                }
                if (source.settings.startDate != null && source.settings.startDate > source.tasks[taskId].from) {
                    continue;
                }
                if (source.settings.endDate != null && (source.settings.endDate + 86400000) < source.tasks[taskId].to) {
                    continue;
                }
                var color = _tcGetColor(count);
                source.tasks[taskId].color = color;
                var task = {
                    taskId: taskId,
                    name: source.tasks[taskId].name,
                    from: source.tasks[taskId].from,
                    to: source.tasks[taskId].to,
                    elapse: source.tasks[taskId].to - source.tasks[taskId].from,
                    clickEventArg: source.tasks[taskId].clickEventArg,
                    color: source.tasks[taskId].color 
                };
                commonData.tasks.push(task);
                count += 1;
            }
        }
        if (source.settings.startDate == null) {
            source.settings.startDate = startDateMin;
        }
        if (source.settings.endDate == null) {
            source.settings.endDate = endDateMax;
        }
        commonData.tickWidth = source.settings.fontSize * 25 / 2;
        commonData.fromMin = d3.min(commonData.tasks, function(d){ return d.from });
        commonData.toMax = d3.max(commonData.tasks, function(d){ return d.to });
        commonData.elapseMax = d3.max(commonData.tasks, function(d){ return d.elapse });
        commonData.startDateMin = startDateMin;
        commonData.endDateMax = endDateMax;
        return commonData;
    }

    var _tcDrawCreateContainers = function(self, divSel, containerData) {
        var containers = d3.selectAll(self)
                           .selectAll(divSel)
                           .selectAll("div")
                           .data(containerData);
        containers.attr("class", function(d) { return d.cls })
        containers.enter()
                      .append("div")
                      .attr("class", function(d) { return d.cls })
        containers.exit().remove();
    }

    var _tcDrawCreateScrollButtons = function(self, divSel, scrollButtonsData) {
        var scrollButtons = d3.selectAll(self)
                              .selectAll(divSel)
                              .selectAll("div.scrollButtonsContainer")
                              .selectAll("button")
                              .data(scrollButtonsData);
        scrollButtons.attr("class", function(d) { return d.cls })
                     .text(function(d) { return d.label })
        scrollButtons.enter()
                         .append("button")
                         .attr("class", function(d) { return d.cls })
                         .text(function(d) { return d.label })
                         .on("click", function(d) {
                             $('html,body').animate(
                                 { scrollTop: $(d.target).offset().top},
                                 { duration: 100, easing: "swing" }
                             );
                         });
        scrollButtons.exit().remove();
        return scrollButtons;
    }

    var _tcDrawCreateSummaryButton = function(self, divSel, summaryButtonData, callback) {
        var summaryButton = d3.selectAll(self)
                              .selectAll(divSel)
                              .selectAll("div.optionsContainer")
                              .selectAll("button")
                              .data(summaryButtonData);
        summaryButton.attr("class", "tchartButton ui-corner-all")
                     .text(function(d) { return d.label })
                     .on("click", function(d) {
                         callback();
                     });
        summaryButton.enter()
                         .append("button")
                         .attr("class", "tchartButton ui-corner-all")
                         .text(function(d) { return d.label })
                         .on("click", function(d) {
                             callback();
                         });
        summaryButton.exit().remove();
        return summaryButton;
    }

    var _tcDrawCreatePrevNextInputs = function(self, divSel, startValue, stepValue, callbackAll, callbackPrev, callbackStart, callbackStep, callbackNext) {
        var prevNextContainers = d3.selectAll(self)
                                   .selectAll(divSel)
                                   .selectAll("div.optionsContainer")
                                   .selectAll("span")
                                   .data([{cls: "allContainer", label: ""},
                                          {cls: "prevContainer", label: ""},
                                          {cls: "startContainer", label: "start"},
                                          {cls: "stepContainer", label: "step"},
                                          {cls: "nextContainer", label: ""}]);
        prevNextContainers.enter()
                              .append("span")
                              .attr("class", function(d) { return d.cls })
                              .text(function(d) { return d.label })
        prevNextContainers.exit().remove();

        var allButton = d3.selectAll(self)
                          .selectAll(divSel)
                          .selectAll("div.optionsContainer")
                          .selectAll("span.allContainer")
                          .selectAll("button")
                          .data([{label: "all" }]);
        allButton.enter()
                     .append("button")
                     .attr("class", "tchartButton ui-corner-all")
                     .text(function(d) { return d.label })
                     .on("click", function(d) {
                         callbackAll();
                     });
        allButton.exit().remove();

        var prevButton = d3.selectAll(self)
                          .selectAll(divSel)
                          .selectAll("div.optionsContainer")
                          .selectAll("span.prevContainer")
                          .selectAll("button")
                          .data([{ label: "prev" }]);
        prevButton.enter()
                     .append("button")
                     .attr("class", "tchartButton ui-corner-all")
                     .text(function(d) { return d.label })
                     .on("click", function(d) {
                         callbackPrev();
                     });
        prevButton.exit().remove();

        var startInput = d3.selectAll(self)
                          .selectAll(divSel)
                          .selectAll("div.optionsContainer")
                          .selectAll("span.startContainer")
                          .selectAll("input")
                          .data([{cls: "startInput", type : "number"}]);
        startInput.enter()
                     .append("input")
                     .attr("class", function(d) { return d.cls })
                     .attr("type", function(d) { return d.type })
                     .on("change", function(d) {
                         callbackStart(this, d3.event);
                     });
        startInput.exit().remove();
        self.find("div.optionsContainer > span.startContainer > input.startInput").val(startValue + 1);

        var stepInput = d3.selectAll(self)
                          .selectAll(divSel)
                          .selectAll("div.optionsContainer")
                          .selectAll("span.stepContainer")
                          .selectAll("input")
                          .data([{cls: "stepInput", type : "number"}]);
        stepInput.enter()
                     .append("input")
                     .attr("class", function(d) { return d.cls })
                     .attr("type", function(d) { return d.type })
                     .on("change", function(d) {
                         callbackStep(this, d3.event);
                     });
        stepInput.exit().remove();
        self.find("div.optionsContainer > span.stepContainer > input.stepInput").val(stepValue);

        var nextButton = d3.selectAll(self)
                          .selectAll(divSel)
                          .selectAll("div.optionsContainer")
                          .selectAll("span.nextContainer")
                          .selectAll("button")
                          .data([{ label: "next" }]);
        nextButton.enter()
                     .append("button")
                     .attr("class", "tchartButton ui-corner-all")
                     .text(function(d) { return d.label })
                     .on("click", function(d) {
                         callbackNext();
                     });
        nextButton.exit().remove();

        return prevNextContainers;
    }

    var _tcDrawCreateHeadTailInputs = function(self, divSel, headValue, tailValue, callbackAll, callbackHead, callbackTail) {
        var headTailContainers = d3.selectAll(self)
                                   .selectAll(divSel)
                                   .selectAll("div.optionsContainer")
                                   .selectAll("span")
                                   .data([{cls: "allContainer", label: ""},
                                          {cls: "headContainer", label: "head"},
                                          {cls: "tailContainer", label: "tail"}]);
        headTailContainers.enter()
                              .append("span")
                              .attr("class", function(d) { return d.cls })
                              .text(function(d) { return d.label })
        headTailContainers.exit().remove();

        var allButton = d3.selectAll(self)
                          .selectAll(divSel)
                          .selectAll("div.optionsContainer")
                          .selectAll("span.allContainer")
                          .selectAll("button")
                          .data([{ label: "all" }]);
        allButton.enter()
                     .append("button")
                     .attr("class", "tchartButton ui-corner-all")
                     .text(function(d) { return d.label })
                     .on("click", function(d) {
                         callbackAll();
                     });
        allButton.exit().remove();

        var headInput = d3.selectAll(self)
                          .selectAll(divSel)
                          .selectAll("div.optionsContainer")
                          .selectAll("span.headContainer")
                          .selectAll("input")
                          .data([{cls: "headInput", type : "number"}]);
        headInput.enter()
                     .append("input")
                     .attr("class", function(d) { return d.cls })
                     .attr("type", function(d) { return d.type })
                     .on("change", function(d) {
                         callbackHead(this, d3.event);
                     });
        headInput.exit().remove();
        self.find("div.optionsContainer > span.headContainer > input.headInput").val(headValue);

        var tailInput = d3.selectAll(self)
                          .selectAll(divSel)
                          .selectAll("div.optionsContainer")
                          .selectAll("span.tailContainer")
                          .selectAll("input")
                          .data([{cls: "tailInput", type : "number"}]);
        tailInput.enter()
                     .append("input")
                     .attr("class", function(d) { return d.cls })
                     .attr("type", function(d) { return d.type })
                     .on("change", function(d) {
                         callbackTail(this, d3.event);
                     });
        tailInput.exit().remove();
        self.find("div.optionsContainer > span.tailContainer > input.tailInput").val(tailValue);

        return headTailContainers;
    }

    var _tcDrawCreateTopSvg = function(self, divSel, topSvgData) {
        var topSvg = d3.selectAll(self)
                       .selectAll(divSel)
                       .selectAll("svg")
                       .data(topSvgData);
        topSvg.attr("class", function(d) { return d.cls })
              .attr("width", function(d) { return d.width })
              .attr("height", function(d) { return d.height })
              .attr("viewBox", function(d) { return d.viewBox });
        topSvg.enter()
              .append("svg")
              .attr("class", function(d) { return d.cls })
              .attr("width", function(d) { return d.width })
              .attr("height", function(d) { return d.height })
              .attr("viewBox", function(d) { return d.viewBox });
        topSvg.exit().remove();
        return topSvg;
    }

    var _tcDrawCreateSubSvgs = function(topSvg, svgSel, subSvgsData) {
        var subSvgs = topSvg.selectAll(svgSel)
                            .data(subSvgsData)
        subSvgs.attr("x", function(d) { return d.x })
               .attr("y", function(d) { return d.y })
               .attr("width", function(d) { return d.width })
               .attr("height", function(d) { return d.height })
               .attr("viewBox", function(d) { return d.viewBox });
        subSvgs.enter()
                   .append("svg")
                   .attr("class", function(d) { return d.cls })
                   .attr("preserveAspectRatio", function(d) { return d.preserveAspectRatio})
                   .attr("x", function(d) { return d.x })
                   .attr("y", function(d) { return d.y })
                   .attr("width", function(d) { return d.width })
                   .attr("height", function(d) { return d.height })
                   .attr("viewBox", function(d) { return d.viewBox});
        subSvgs.exit().remove();
        return subSvgs;
    }

    var _tcDrawCreateTasksRects = function(topSvg, subSvg, rectSel, tasksRectsData, source, onTaskClick) {
        var tasksRects = topSvg.selectAll(subSvg)
                               .selectAll(rectSel)
                               .data(tasksRectsData);
        tasksRects.attr("x", function(d) { return d.x; })
                  .attr("y", function(d) { return d.y; })
                  .attr("width", function(d) { return d.width; })
                  .attr("height", function(d) { return d.height; })
                  .attr("fill", function(d) { return d.color; });
        tasksRects.enter()
                      .append("rect")
                      .attr("x", function(d) { return d.x; })
                      .attr("y", function(d) { return d.y; })
                      .attr("rx", function(d) { return d.rx; })
                      .attr("ry", function(d) { return d.ry; })
                      .attr("width", function(d) { return d.width; })
                      .attr("height", function(d) { return d.height; })
                      .attr("class", function(d) { return d.cls; })
                      .attr("fill", function(d) { return d.color; })
                      .on("click", function(d) {
                           if (onTaskClick && d.taskId) {
                               onTaskClick(source.tasks[d.taskId].clickEventArg, this, d3.event);
			   }
                      });
        tasksRects.exit().remove();
        return tasksRects;
    }

    var _tcDrawCreateLines = function(topSvg, subSvg, lineSel, linesData) {
        var lines = topSvg.selectAll(subSvg)
                          .selectAll(lineSel)
                          .data(linesData);
        lines.attr("x1", function(d) { return d.x1 })
             .attr("y1", function(d) { return d.y1 })
             .attr("x2", function(d) { return d.x2 })
             .attr("y2", function(d) { return d.y2 });
        lines.enter()
                 .append("line")
                 .attr("x1", function(d) { return d.x1 })
                 .attr("y1", function(d) { return d.y1 })
                 .attr("x2", function(d) { return d.x2 })
                 .attr("y2", function(d) { return d.y2 })
                 .attr("class", function(d) { return d.cls })
        lines.exit().remove();
        return lines;
    }

    var _tcDrawCreateLabels = function(topSvg, subSvg, textSel, labelsData, fontSize) {
        var labels = topSvg.selectAll(subSvg)
                           .selectAll(textSel)
                           .data(labelsData);
        labels.text(function(d) {return d.label})
              .attr("x", function(d) { return d.x; })
              .attr("y", function(d) { return d.y; })
              .style("font-size", fontSize + "px");
        labels.enter()
                  .append("text")
                  .text(function(d) {return d.label})
                  .attr("x", function(d) { return d.x; })
                  .attr("y", function(d) { return d.y; })
                  .attr("class", function(d){ return d.cls; })
                  .style("font-size", fontSize + "px");
        labels.exit().remove();
        return labels;
    }

    var _tcDrawCreateAxis = function(topSvg, subSvg, axisSel, axisData, axisScales, fontSize) {
        var axis = topSvg.selectAll(subSvg)
                         .selectAll(axisSel)
                         .data(axisData);
        axis.attr("class", function(d){ return d.cls; })
            .attr("transform", function(d) { return d.trans; });
        axis.enter()
                .append("g")
                .attr("transform", function(d) { return  d.trans; })
                .attr("class", function(d){ return d.cls; });
        axis.exit().remove();
        for (var i = 0; i < axisScales.length; i++) {
            topSvg.selectAll(subSvg)
                  .selectAll(axisScales[i].group)
                  .call(axisScales[i].scale)
                  .selectAll("text")
                  .style("font-size", fontSize + "px")
                  .style("text-anchor", "start");
        }
        return axis;
    }

    var _tcDrawCreateBrushRects = function(topSvg, subSvg, rectSel, brushRectsData) {
        var brushRects = topSvg.selectAll(subSvg)
                               .selectAll(rectSel)
                               .data(brushRectsData);
        brushRects.attr("x", function(d) { return d.x; })
                  .attr("y", function(d) { return d.y; })
                  .attr("width", function(d) { return d.width; })
                  .attr("height", function(d) { return d.height; })
                  .attr("fill", function(d) { return d.color; });
        brushRects.enter()
                      .append("rect")
                      .attr("x", function(d) { return d.x; })
                      .attr("y", function(d) { return d.y; })
                      .attr("rx", function(d) { return d.rx; })
                      .attr("ry", function(d) { return d.ry; })
                      .attr("width", function(d) { return d.width; })
                      .attr("height", function(d) { return d.height; })
                      .attr("class", function(d) { return d.cls; })
                      .attr("fill", function(d) { return d.color; });
        brushRects.exit().remove();
        return brushRects;
    }

    var _tcDrawCreateBrush = function(topSvg, subSvg, brushSel, brushData, brushScales) {
        var brush = topSvg.selectAll(subSvg)
                          .selectAll(brushSel)
                          .data(brushData)
        brush.attr("class", function(d){ return d.cls; })
        brush.enter()
                 .append("g")
                 .attr("class", function(d){ return d.cls; })
        brush.exit().remove();
        for (var i = 0; i < brushScales.length; i++) {
            if (brushScales[i].type == "x") {
                topSvg.selectAll(subSvg)
                      .selectAll(brushScales[i].group)
                      .call(brushScales[i].scale)
                      .selectAll("rect")
                          .attr("height", brushScales[i].height)
            }
        }
        return brush;
    }

    var _tcDrawActorsSummaryBarChart = function(self, source, onTaskClick, commonData) {
        if (source.actors == null || !source.settings.drawActorsSummaryBarChart) {
            return;
        }
        // get need param
        if (commonData == null) {
            commonData = _tcGetCommonData(source);
        }
        var maxNameLen = 0;
        for (actorId in source.actors) {
            var len = _tcGetStringLength(source.actors[actorId].name);
            if (maxNameLen < len) {
                maxNameLen = len;
            }
        }
        // create summary data
        var actors = [];
	var count = 0;
	var tasksMax = 0;
        for (actorId in source.actors) {
		var actor = {
		    name: actorId,
		    color: _tcGetColor(count),
		    taskSize: source.actors[actorId].tasks.length,
		    taskId: null,
		    clickEventArg: null
		}
		if (tasksMax < source.actors[actorId].tasks.length) {
			tasksMax = source.actors[actorId].tasks.length;
		}
		actors.push(actor);
		count += 1;
	}
        // sort
        var sortedActors =  d3.values(actors).sort(function(a, b){ return d3.descending(a.taskSize, b.taskSize); });
        // defines
        var brushEndCb = function() {
            var extent = d3.event.target.extent();
            source.settings.actorsSummaryBarChart.viewRange.from = extent[0];
            source.settings.actorsSummaryBarChart.viewRange.to = extent[1];
            _tcDrawActorsSummaryBarChart(self, source, onTaskClick, null);
        }
        var fontSize = source.settings.fontSize;
        var yPadding = 8;
        var xOffset = ((maxNameLen * fontSize)/1.8) + fontSize + yPadding;
        var axisHeight = 8 + fontSize + yPadding + fontSize + yPadding; 
        var yOffset = axisHeight;
        var brushHeight = source.settings.brushHeight + yPadding;
        var barMaxHeight = source.settings.actorsSummaryBarChart.barMaxHeight;
        var canvasHeight = barMaxHeight * sortedActors.length; 
        var canvasWidth = source.settings.width - xOffset;
        var svgHeight = yOffset + canvasHeight + axisHeight + brushHeight + 20;
        var svgWidth = xOffset + canvasWidth;
        var xmax = tasksMax;
        var brushFromTo = _tcAdjustBlushValue(source.settings.actorsSummaryBarChart.viewRange.from,
                                              source.settings.actorsSummaryBarChart.viewRange.to,
                                              0,
                                              xmax);
        var zoom = xmax / (brushFromTo[1] - brushFromTo[0]);
        if ((brushFromTo[1] - brushFromTo[0]) == 0) {
           zoom = 1;
        }
        
        var x = d3.scale.linear()
                        .domain([0, xmax])
                        .range([0, canvasWidth]);
        var axisX = d3.scale.linear()
                             .domain([0, xmax])
                             .range([0, canvasWidth * zoom]);
        var y = d3.scale.linear()
                        .domain([0, 1])
                        .range([0, barMaxHeight]);
        var brushY = d3.scale.linear()
                              .domain([0, sortedActors.length])
                              .range([0, brushHeight - yPadding]);
        var xAxisTop = d3.svg.axis()
                             .scale(axisX)
                             .orient("top")
                             .ticks((canvasWidth / commonData.tickWidth) * zoom)
                             .tickSize(8, 4, 2)
        var xAxisBottom = d3.svg.axis()
                                .scale(axisX)
                                .orient("bottom")
                                .ticks((canvasWidth / commonData.tickWidth) * zoom)
                                .tickSize(8, 4, 2)
        var xBrushScale = d3.svg.brush().x(x)
                                        .on("brushend", brushEndCb)
                                        .extent(_tcGetBrushExtent(source.settings.actorsSummaryBarChart.viewRange, 0, xmax));
        // convert data
        var topSvgData = [{cls: "actorsSummaryBarChartSvg",
                           width: svgWidth,
                           height: svgHeight,
                           viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + svgHeight }];
        var subSvgsData = [{cls: "actorsSummaryBarChartRectsSvg actorsSummaryBarChartSubSvg",
                            x: xOffset,
                            y: yOffset,
                            width: canvasWidth,
                            height: canvasHeight,
                            preserveAspectRatio: "none",
                            viewBox: "" + x(brushFromTo[0]) + " " + 0 + " " + (canvasWidth / zoom) + " " + canvasHeight },
                           {cls: "actorsSummaryBarChartAxisSvg actorsSummaryBarChartSubSvg",
                            x: xOffset,
                            y: 0,
                            preserveAspectRatio: "xMidYMid",
                            width: canvasWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            viewBox: "" + axisX(brushFromTo[0]) + " " + 0 + " " + canvasWidth + " " + (yOffset +canvasHeight + axisHeight) },
                           {cls: "actorsSummaryBarChartLinesSvg actorsSummaryBarChartSubSvg",
                            x: 0,
                            y: 0,
                            width: svgWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + (yOffset + canvasHeight + axisHeight) },
                           {cls: "actorsSummaryBarChartLabelsSvg actorsSummaryBarChartSubSvg",
                            x: 0,
                            y: 0,
                            width: svgWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + (yOffset + canvasHeight + axisHeight) },
                           {cls: "actorsSummaryBarChartBrushSvg actorsSummaryBarChartSubSvg",
                            x: xOffset,
                            y: yOffset + canvasHeight + axisHeight,
                            width: canvasWidth,
                            height: brushHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + canvasWidth + " " + brushHeight }];
        var axisData = [{trans: "translate(0, " + yOffset + ")" ,
                         cls: "actorsSummaryBarChartXAxisTop actorsSummaryBarChartAxis",
                         scale: "x"},
                        {trans: "translate(0, " + (yOffset + canvasHeight) + ")" ,
                         cls: "actorsSummaryBarChartXAxisBottom actorsSummaryBarChartAxis",
                         scale: "x"}];
        var axisScales = [{group: "g.actorsSummaryBarChartXAxisTop",
                           scale: xAxisTop},
                          {group: "g.actorsSummaryBarChartXAxisBottom",
                           scale: xAxisBottom}];
        var brushData = [{cls:"actorsSummaryBarChartXBrush actorsSummaryBarChartBrush"}];
        var brushScales = [{group: "g.actorsSummaryBarChartXBrush",
                            scale: xBrushScale,
                            type: "x",
                            height: brushHeight - yPadding}];
        var tasksRectsData = [];
        var linesData = [];
        var labelsData = [];
        var brushRectsData = [];
        brushRectsData.push({cls:"actorsSummaryBarChartBrushBackgroundRect actorsSummaryBarChartBrushRect",
                            x: 0,
                            y: 0,
                            ry: 0,
                            ry: 0,
                            width: canvasWidth,
                            height: brushHeight - yPadding,
                            fill: "" });
        for (var i = 0; i < sortedActors.length; i++) {
            linesData.push({ x1: xOffset,
                             y1: y(i) + yOffset,
                             x2: canvasWidth + xOffset,
                             y2: y(i) + yOffset,
                             cls: "actorsSummaryBarChartLaneLine actorsSummaryBarChartLine" });
            labelsData.push({ x: 0,
                              y: yOffset + y(i) + (barMaxHeight / 2) + (fontSize / 2),
                              label: sortedActors[i].name,
                              cls: "actorsSummaryBarChartLabel" });
            tasksRectsData.push({ x: x(0),
                                  y: y(i) + (barMaxHeight/16),
                                  rx: 6,
                                  ry: 6,
                                  width: x(sortedActors[i].taskSize) - x(0),
                                  height: barMaxHeight - ((barMaxHeight/16) * 2),
                                  taskId: null,
                                  color: sortedActors[i].color,
                                  cls: "actorsSummaryBarChartTaskRect" }); 
            brushRectsData.push({ x: x(0),
                                  y: brushY(i),
                                  rx: 3,
                                  ry: 3,
                                  width: x(sortedActors[i].taskSize) - x(0),
                                  height: (brushHeight - yPadding) / sortedActors.length,
                                  color: sortedActors[i].color,
                                  cls: "actorsSummaryBarChartBrushTaskRect actorsSummaryBarChartBrushRect" }); 
        }
        linesData.push({ x1: xOffset,
                         y1: yOffset,
                         x2: xOffset,
                         y2: canvasHeight + yOffset,
                         cls: "actorsSummaryBarChartCanvasLine actorsSummaryBarChartLine" });
        linesData.push({ x1: canvasWidth + xOffset,
                         y1: yOffset,
                         x2: canvasWidth + xOffset,
                         y2: canvasHeight + yOffset,
                         cls:  "actorsSummaryBarChartCanvasLine actorsSummaryBarChartLine" });
        linesData.push({ x1: xOffset,
                         y1: yOffset,
                         x2: canvasWidth + xOffset,
                         y2: yOffset,
                         cls: "actorsSummaryBarChartCanvasLine actorsSummaryBarChartLine" });
        linesData.push({ x1: xOffset,
                         y1: canvasHeight + yOffset,
                         x2: canvasWidth + xOffset,
                         y2: canvasHeight + yOffset,
                         cls: "actorsSummaryBarChartCanvasLine actorsSummaryBarChartLine" });
        labelsData.push({ x: xOffset + canvasWidth - (fontSize * 4),
                          y: yPadding + fontSize,
                          label: "(tasks)",
                          cls: "actorsSummaryBarChartLabel"});
        labelsData.push({ x: xOffset + canvasWidth - (fontSize * 4),
                          y: yOffset + canvasHeight + axisHeight - yPadding,
                          label: "(tasks)",
                          cls: "actorsSummaryBarChartLabel"});
        labelsData.push({ x: 0,
                          y: yOffset - yPadding,
                          label: "(actors)",
                          cls: "actorsSummaryBarChartLabel" });

        var containers = _tcDrawCreateContainers(self,
                                                 "div.actorsSummaryBarChart",
                                                 commonData.containers);
        var scrollButtons = _tcDrawCreateScrollButtons(self,
                                                       "div.actorsSummaryBarChart",
                                                       commonData.scrolls);
        var summaryButtonData = [{ label: "detail" }];
        var summaryButton = _tcDrawCreateSummaryButton(self,
                                                       "div.actorsSummaryBarChart",
                                                       summaryButtonData,
                                                       function() {
                                                           source.settings.drawActorsSummaryBarChart = false;
                                                           _tcDraw(self, source, onTaskClick);
                                                       });
        var topSvg = _tcDrawCreateTopSvg(self,
                                         "div.actorsSummaryBarChart",
                                         topSvgData);
        var subSvgs = _tcDrawCreateSubSvgs(topSvg,
                                           "svg.actorsSummaryBarChartSubSvg",
                                           subSvgsData);
        var tasksRects = _tcDrawCreateTasksRects(topSvg,
                                                 "svg.actorsSummaryBarChartRectsSvg",
                                                 "actorsSummaryBarChartTaskRect",
                                                 tasksRectsData,
                                                 source,
                                                 null);
        var lines = _tcDrawCreateLines(topSvg,
                                       "svg.actorsSummaryBarChartLinesSvg",
                                       "line.actorsSummaryBarChartLine",
                                       linesData);
        var labels = _tcDrawCreateLabels(topSvg,
                                         "svg.actorsSummaryBarChartLabelsSvg",
                                         "text.actorsSummaryBarChartLabel",
                                         labelsData,
                                         fontSize);
        var axis = _tcDrawCreateAxis(topSvg,
                                     "svg.actorsSummaryBarChartAxisSvg",
                                     "g.actorsSummaryBarChartAxis",
                                     axisData,
                                     axisScales,
                                     fontSize);
        var brushRects = _tcDrawCreateBrushRects(topSvg,
                                                  "svg.actorsSummaryBarChartBrushSvg",
                                                  "rect.actorsSummaryBarChartBrushRect",
                                                   brushRectsData);
        var brush = _tcDrawCreateBrush(topSvg,
                                       "svg.actorsSummaryBarChartBrushSvg",
                                       "g.actorsSummaryBarChartBrush",
                                       brushData,
                                       brushScales);
    }

    var _tcDrawActorsSwimlaneChart = function(self, source, onTaskClick, commonData) {
        if (source.actors == null || !source.settings.drawActorsSwimlaneChart) {
            return;
        }
        // get need param
        if (commonData == null) {
            commonData = _tcGetCommonData(source);
        }
        var maxNameLen = 0;
        for (actorId in source.actors) {
            var len = _tcGetStringLength(source.actors[actorId].name);
            if (maxNameLen < len) {
                maxNameLen = len;
            }
        }
        // defines
        var brushEndCb = function() {
            var extent = d3.event.target.extent();
            source.settings.actorsSwimlaneChart.viewRange.from = extent[0];
            source.settings.actorsSwimlaneChart.viewRange.to = extent[1];
            _tcDrawActorsSwimlaneChart(self, source, onTaskClick, null);
        }
        var fontSize = source.settings.fontSize;
        var yPadding = 8;
        var xOffset = ((maxNameLen * fontSize) / 1.8) + fontSize + yPadding;
        var axisHeight = 8 + ((fontSize + yPadding) * 2) + fontSize; 
        var yOffset = axisHeight;
        var brushHeight = source.settings.brushHeight + yPadding;
        var barMaxHeight = source.settings.actorsSwimlaneChart.barMaxHeight;
        var canvasHeight = barMaxHeight * commonData.tasks.length; 
        var canvasWidth = source.settings.width - xOffset;
        var svgHeight = yOffset + canvasHeight + axisHeight + brushHeight + 20;
        var svgWidth = xOffset + canvasWidth;
        var xmax = commonData.toMax;
        var startTime = source.settings.startTime;
        if (startTime == null) {
            startTime = commonData.fromMin;
        }
        var brushFromTo = _tcAdjustBlushValue(source.settings.actorsSwimlaneChart.viewRange.from,
                                              source.settings.actorsSwimlaneChart.viewRange.to,
                                              startTime,
                                              xmax);
        var zoom = (xmax - startTime) / (brushFromTo[1] - brushFromTo[0]);
        if ((brushFromTo[1] - brushFromTo[0]) == 0) {
           zoom = 1;
        }
        var x = d3.scale.linear()
                        .domain([startTime, xmax])
                        .range([0, canvasWidth]);
        var axisX = d3.scale.linear()
                             .domain([startTime, xmax])
                             .range([0, canvasWidth * zoom]);
        var axisXRel = d3.scale.linear()
                               .domain([0, xmax - startTime])
                               .range([0, canvasWidth * zoom]);
        var y = d3.scale.linear()
                        .domain([0, 1])
                        .range([0, barMaxHeight]);
        var brushY = d3.scale.linear()
                              .domain([0, commonData.tasks.length])
                              .range([0, brushHeight - yPadding]);
        var xAxisTop = d3.svg.axis()
                             .scale(axisX)
                             .orient("top")
                             .ticks((canvasWidth / commonData.tickWidth) * zoom)
                             .tickSize(8, 4, 2)
                             .tickPadding(fontSize + 3)
                             .tickFormat(function(d) { return _tcTimestampFormat(d, brushFromTo); })
        var xRelAxisTop = d3.svg.axis()
                                .scale(axisXRel)
                                .orient("top")
                                .ticks((canvasWidth / commonData.tickWidth) * zoom)
                                .tickSize(8, 4, 2)
                                .tickFormat(function(d) { return _tcElapsedTimeFormat(d, brushFromTo); })
        var xAxisBottom = d3.svg.axis()
                                .scale(axisX)
                                .orient("bottom")
                                .ticks((canvasWidth / commonData.tickWidth) * zoom)
                                .tickSize(8, 4, 2)
                                .tickPadding(fontSize + 3)
                                .tickFormat(function(d) { return _tcTimestampFormat(d, brushFromTo); })
        var xRelAxisBottom = d3.svg.axis()
                                   .scale(axisXRel)
                                   .orient("bottom")
                                   .ticks((canvasWidth / commonData.tickWidth) * zoom)
                                   .tickSize(8, 4, 2)
                                   .tickFormat(function(d) { return _tcElapsedTimeFormat(d, brushFromTo); })
        var xBrushScale = d3.svg.brush().x(x)
                                        .on("brushend", brushEndCb)
                                        .extent(_tcGetBrushExtent(source.settings.actorsSwimlaneChart.viewRange, startTime, xmax));
        // convert data
        var topSvgData = [{cls: "actorsSwimlaneChartSvg",
                           width: svgWidth,
                           height: svgHeight,
                           viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + svgHeight }];
        var subSvgsData = [{cls: "actorsSwimlaneChartRectsSvg actorsSwimlaneChartSubSvg",
                            x: xOffset,
                            y: yOffset,
                            width: canvasWidth,
                            height: canvasHeight,
                            preserveAspectRatio: "none",
                            viewBox: "" + x(brushFromTo[0]) + " " + 0 + " " + (canvasWidth / zoom) + " " + canvasHeight },
                           {cls: "actorsSwimlaneChartAxisSvg actorsSwimlaneChartSubSvg",
                            x: xOffset,
                            y: 0,
                            preserveAspectRatio: "xMidYMid",
                            width: canvasWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            viewBox: "" + axisX(brushFromTo[0]) + " " + 0 + " " + canvasWidth + " " + (yOffset + canvasHeight + axisHeight) },
                           {cls: "actorsSwimlaneChartLinesSvg actorsSwimlaneChartSubSvg",
                            x: 0,
                            y: 0,
                            width: svgWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + (yOffset + canvasHeight + axisHeight) },
                           {cls: "actorsSwimlaneChartLabelsSvg actorsSwimlaneChartSubSvg",
                            x: 0,
                            y: 0,
                            width: svgWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + (yOffset + canvasHeight + axisHeight) },
                           {cls: "actorsSwimlaneChartBrushSvg actorsSwimlaneChartSubSvg",
                            x: xOffset,
                            y: yOffset + canvasHeight + axisHeight,
                            width: canvasWidth,
                            height: brushHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + canvasWidth + " " + brushHeight }];
        var axisData = [{trans: "translate(0, " +  yOffset + ")" ,
                         cls: "actorsSwimlaneChartXAxisTop actorsSwimlaneChartAxis",
                         scale: "x"},
                        {trans: "translate(0, " +  yOffset + ")" ,
                         cls: "actorsSwimlaneChartXRelAxisTop actorsSwimlaneChartRelAxis",
                         scale: "x"},
                        {trans: "translate(0, " + (yOffset + canvasHeight) + ")" ,
                         cls: "actorsSwimlaneChartXAxisBottom actorsSwimlaneChartAxis",
                         scale: "x"},
                        {trans: "translate(0, " + (yOffset + canvasHeight) + ")" ,
                         cls: "actorsSwimlaneChartXRelAxisBottom actorsSwimlaneChartRelAxis",
                         scale: "x"}];
        var axisScales = [{group: "g.actorsSwimlaneChartXAxisTop",
                           scale: xAxisTop},
                          {group: "g.actorsSwimlaneChartXRelAxisTop",
                           scale: xRelAxisTop},
                          {group: "g.actorsSwimlaneChartXAxisBottom",
                           scale: xAxisBottom},
                          {group: "g.actorsSwimlaneChartXRelAxisBottom",
                           scale: xRelAxisBottom}];
        var brushData = [{cls:"actorsSwimlaneChartXBrush actorsSwimlaneChartBrush"}];
        var brushScales = [{group: "g.actorsSwimlaneChartXBrush",
                            scale: xBrushScale,
                            type: "x",
                            height: brushHeight - yPadding}];
        var tasksRectsData = [];
        var linesData = [];
        var labelsData = [];
        var brushRectsData = [];
        var totalTaskCount = 0;
        brushRectsData.push({cls:"actorsSwimlaneChartBrushBackgroundRect actorsSwimlaneChartBrushRect",
                            x: 0,
                            y: 0,
                            ry: 0,
                            ry: 0,
                            width: canvasWidth,
                            height: brushHeight - yPadding,
                            fill: "" });
        for (actorId in source.actors) {
            var laneMaxHeight = barMaxHeight * source.actors[actorId].tasks.length;
            linesData.push({ x1: xOffset,
                             y1: y(totalTaskCount) + yOffset,
                             x2: canvasWidth + xOffset,
                             y2: y(totalTaskCount) + yOffset,
                             cls: "actorsSwimlaneChartLaneLine actorsSwimlaneChartLine" });
            labelsData.push({ x: 0,
                              y: yOffset + y(totalTaskCount) + (laneMaxHeight / 2) + (fontSize / 2),
                              label: source.actors[actorId].name,
                              cls: "actorsSwimlaneChartLabel" });
            for (var j = 0; j < source.actors[actorId].tasks.length; j++) {
                var task = source.tasks[source.actors[actorId].tasks[j]];
                tasksRectsData.push({ x: x(task.from),
                                     y: y(totalTaskCount) + (barMaxHeight/16),
                                     rx: 6,
                                     ry: 6,
                                     width: x(task.to) - x(task.from),
                                     height: barMaxHeight - ((barMaxHeight/16) * 2),
                                     taskId: source.actors[actorId].tasks[j],
                                     color: task.color,
                                     cls: "actorsSwimlaneChartTaskRect" }); 
                brushRectsData.push({ x: x(task.from),
                                     y: brushY(totalTaskCount),
                                     rx: 3,
                                     ry: 3,
                                     width: x(task.to) - x(task.from),
                                     height: (brushHeight - yPadding) / commonData.tasks.length,
                                     color: task.color,
                                     cls: "actorsSwimlaneChartBrushTaskRect actorsSwimlaneChartBrushRect" }); 
                totalTaskCount += 1;
            }
        }
        linesData.push({ x1: xOffset,
                         y1: yOffset,
                         x2: xOffset,
                         y2: canvasHeight + yOffset,
                         cls: "actorsSwimlaneChartCanvasLine actorsSwimlaneChartLine" });
        linesData.push({ x1: canvasWidth + xOffset,
                         y1: yOffset,
                         x2: canvasWidth + xOffset,
                         y2: canvasHeight + yOffset,
                         cls:  "actorsSwimlaneChartCanvasLine actorsSwimlaneChartLine" });
        linesData.push({ x1: xOffset,
                         y1: yOffset,
                         x2: canvasWidth + xOffset,
                         y2: yOffset,
                         cls: "actorsSwimlaneChartCanvasLine actorsSwimlaneChartLine" });
        linesData.push({ x1: xOffset,
                         y1: canvasHeight + yOffset,
                         x2: canvasWidth + xOffset,
                         y2: canvasHeight + yOffset,
                         cls: "actorsSwimlaneChartCanvasLine actorsSwimlaneChartLine" });
        labelsData.push({ x: xOffset + canvasWidth - (fontSize * 4),
                          y: yPadding + fontSize,
                          label: "(time)",
                          cls: "actorsSwimlaneChartLabel"});
        labelsData.push({ x: xOffset + canvasWidth - (fontSize * 4),
                          y: yOffset + canvasHeight + axisHeight - yPadding,
                          label: "(time)",
                          cls: "actorsSwimlaneChartLabel"});
        labelsData.push({ x: 0,
                          y: yOffset - yPadding,
                          label: "(actors)",
                          cls: "actorsSwimlaneChartLabel" });

        var containers = _tcDrawCreateContainers(self,
                                                 "div.actorsSwimlaneChart",
                                                 commonData.containers);
        var scrollButtons = _tcDrawCreateScrollButtons(self,
                                                       "div.actorsSwimlaneChart",
                                                       commonData.scrolls);
        var summaryButtonData = [{ label: "summary",
                                   cls: "tchartSummaryButton  ui-corner-all"}];
        var summaryButton = _tcDrawCreateSummaryButton(self,
                                                       "div.actorsSwimlaneChart",
                                                       summaryButtonData,
                                                       function() {
                                                           source.settings.drawActorsSummaryBarChart = true;
                                                           _tcDraw(self, source, onTaskClick);
                                                       });
        var topSvg = _tcDrawCreateTopSvg(self,
                                         "div.actorsSwimlaneChart",
                                         topSvgData);
        var subSvgs = _tcDrawCreateSubSvgs(topSvg,
                                           "svg.actorsSwimlaneChartSubSvg",
                                           subSvgsData);
        var tasksRects = _tcDrawCreateTasksRects(topSvg,
                                                 "svg.actorsSwimlaneChartRectsSvg",
                                                 "actorsSwimlaneChartTaskRect",
                                                 tasksRectsData,
                                                 source,
                                                 onTaskClick);
        var lines = _tcDrawCreateLines(topSvg,
                                       "svg.actorsSwimlaneChartLinesSvg",
                                       "line.actorsSwimlaneChartLine",
                                       linesData);
        var labels = _tcDrawCreateLabels(topSvg,
                                         "svg.actorsSwimlaneChartLabelsSvg",
                                         "text.actorsSwimlaneChartLabel",
                                         labelsData,
                                         fontSize);
        var axis = _tcDrawCreateAxis(topSvg,
                                     "svg.actorsSwimlaneChartAxisSvg",
                                     "g.actorsSwimlaneChartAxis",
                                     axisData,
                                     axisScales,
                                     fontSize);
        var brushRects = _tcDrawCreateBrushRects(topSvg,
                                                  "svg.actorsSwimlaneChartBrushSvg",
                                                  "rect.actorsSwimlaneChartBrushRect",
                                                   brushRectsData);
        var brush = _tcDrawCreateBrush(topSvg,
                                       "svg.actorsSwimlaneChartBrushSvg",
                                       "g.actorsSwimlaneChartBrush",
                                       brushData,
                                       brushScales);
    }

    var _tcDrawTasksGanttChart = function(self, source, onTaskClick, commonData) {
        if (!source.settings.drawTasksGanttChart) {
            return;
        }
        // get need param
        if (commonData == null) {
            commonData = _tcGetCommonData(source);
        }
        var maxNameLen = 0;
        for (var i = 0; i < commonData.tasks.length; i++) {
            var len = _tcGetStringLength(commonData.tasks[i].name);
            if (maxNameLen < len) {
                maxNameLen = len;
            }
        }
        // sort
        var sortedTasks = d3.values(commonData.tasks).sort(function(a, b){ return d3.ascending(a.from, b.from); });
        var start = source.settings.tasksGanttChart.start;
        var end = start + source.settings.tasksGanttChart.step;
	if (start > sortedTasks.length - 1) {
            start = 0;
        }
        if (end > sortedTasks.length) {
            end = sortedTasks.length;
        }
	sortedTasks = sortedTasks.slice(start, end);
        // defines
        var brushEndCb = function() {
            var extent = d3.event.target.extent();
            source.settings.tasksGanttChart.viewRange.from = extent[0];
            source.settings.tasksGanttChart.viewRange.to = extent[1];
            _tcDrawTasksGanttChart(self, source, onTaskClick, null);
        }
 
        var fontSize = source.settings.fontSize;
        var yPadding = 8;
        var xOffset = ((maxNameLen * fontSize) / 1.8) + fontSize + yPadding;
        var axisHeight = 8 + ((fontSize + yPadding) * 2) + fontSize;
        var yOffset = axisHeight
        var brushHeight = source.settings.brushHeight + yPadding;
        var barMaxHeight = source.settings.tasksGanttChart.barMaxHeight;
        var laneMaxHeight = source.settings.tasksGanttChart.laneMaxHeight;
        var canvasHeight = laneMaxHeight * sortedTasks.length; 
        var canvasWidth = source.settings.width - xOffset;
        var svgHeight = yOffset + canvasHeight + axisHeight + brushHeight + 20;
        var svgWidth = xOffset + canvasWidth;
        var xmax = commonData.toMax;
        var startTime = source.settings.startTime;
        if (startTime == null) {
            startTime = commonData.fromMin;
        }
        var brushFromTo = _tcAdjustBlushValue(source.settings.tasksGanttChart.viewRange.from,
                                              source.settings.tasksGanttChart.viewRange.to,
                                              startTime,
                                              xmax);
        var zoom = (xmax - startTime) / (brushFromTo[1] - brushFromTo[0]);
        if ((brushFromTo[1] - brushFromTo[0]) == 0) {
           zoom = 1;
        }
        var x = d3.scale.linear()
                        .domain([startTime, xmax])
                        .range([0, canvasWidth]);
        var axisX = d3.scale.linear()
                            .domain([startTime, xmax])
                            .range([0, canvasWidth * zoom]);
        var axisXRel = d3.scale.linear()
                               .domain([0, xmax - startTime])
                               .range([0, canvasWidth * zoom]);
        var y = d3.scale.linear()
                        .domain([0, 1])
                        .range([0, laneMaxHeight]);
        var brushY = d3.scale.linear()
                              .domain([0, sortedTasks.length])
                              .range([0, brushHeight - yPadding]);
        var xAxisTop = d3.svg.axis()
                             .scale(axisX)
                             .orient("top")
                             .ticks((canvasWidth / commonData.tickWidth) * zoom)
                             .tickSize(8, 4, 2)
                             .tickPadding(fontSize + 3)
                             .tickFormat(function(d) { return _tcTimestampFormat(d, brushFromTo); })
        var xRelAxisTop = d3.svg.axis()
                                .scale(axisXRel)
                                .orient("top")
                                .ticks((canvasWidth / commonData.tickWidth) * zoom)
                                .tickSize(8, 4, 2)
                                .tickFormat(function(d) { return _tcElapsedTimeFormat(d, brushFromTo); })
        var xAxisBottom = d3.svg.axis()
                                .scale(axisX)
                                .orient("bottom")
                                .ticks((canvasWidth / commonData.tickWidth) * zoom)
                                .tickSize(8, 4, 2)
                                .tickPadding(fontSize + 3)
                                .tickFormat(function(d) { return _tcTimestampFormat(d, brushFromTo); })
        var xRelAxisBottom = d3.svg.axis()
                                   .scale(axisXRel)
                                   .orient("bottom")
                                   .ticks((canvasWidth / commonData.tickWidth) * zoom)
                                   .tickSize(8, 4, 2)
                                   .tickFormat(function(d) { return _tcElapsedTimeFormat(d, brushFromTo); })
        var xBrushScale = d3.svg.brush().x(x)
                                        .on("brushend", brushEndCb)
                                        .extent(_tcGetBrushExtent(source.settings.tasksGanttChart.viewRange, startTime, xmax));
        // convert data
        var topSvgData = [{cls: "tasksGanttChartSvg",
                           width: svgWidth,
                           height: svgHeight,
                           viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + svgHeight }];
        var subSvgsData = [{cls: "tasksGanttChartRectsSvg tasksGanttChartSubSvg",
                            x: xOffset,
                            y: yOffset,
                            width: canvasWidth,
                            height: canvasHeight,
                            preserveAspectRatio: "none",
                            viewBox: "" + x(brushFromTo[0]) + " " + 0 + " " + (canvasWidth / zoom) + " " + canvasHeight },
                           {cls: "tasksGanttChartAxisSvg tasksGanttChartSubSvg",
                            x: xOffset,
                            y: 0,
                            preserveAspectRatio: "xMidYMid",
                            width: canvasWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            viewBox: "" + axisX(brushFromTo[0]) + " " + 0 + " " + canvasWidth + " " + (yOffset + canvasHeight + axisHeight) },
                           {cls: "tasksGanttChartLinesSvg tasksGanttChartSubSvg",
                            x: 0,
                            y: 0,
                            width: svgWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + (yOffset + canvasHeight + axisHeight) },
                           {cls: "tasksGanttChartLabelsSvg tasksGanttChartSubSvg",
                            x: 0,
                            y: 0,
                            width: svgWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + (yOffset + canvasHeight + axisHeight) },
                           {cls: "tasksGanttChartBrushSvg tasksGanttChartSubSvg",
                            x: xOffset,
                            y: yOffset + canvasHeight + axisHeight,
                            width: canvasWidth,
                            height: brushHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + canvasWidth + " " + brushHeight }];
        var axisData = [{trans: "translate(0, " + (yOffset) + ")" ,
                         cls: "tasksGanttChartXAxisTop tasksGanttChartAxis",
                         scale: "x"},
                        {trans: "translate(0, " + (yOffset) + ")" ,
                         cls: "tasksGanttChartXRelAxisTop tasksGanttChartRelAxis",
                         scale: "x"},
                        {trans: "translate(0, " + (yOffset + canvasHeight) + ")" ,
                         cls: "tasksGanttChartXAxisBottom tasksGanttChartAxis",
                         scale: "x"},
                        {trans: "translate(0, " + (yOffset + canvasHeight) + ")" ,
                         cls: "tasksGanttChartXRelAxisBottom tasksGanttChartRelAxis",
                         scale: "x"}];
        var axisScales = [{group: "g.tasksGanttChartXAxisTop",
                           scale: xAxisTop},
                          {group: "g.tasksGanttChartXRelAxisTop",
                           scale: xRelAxisTop},
                          {group: "g.tasksGanttChartXAxisBottom",
                           scale: xAxisBottom},
                          {group: "g.tasksGanttChartXRelAxisBottom",
                           scale: xRelAxisBottom}];
        var brushData = [{cls:"tasksGanttChartXBrush tasksGanttChartBrush"}];
        var brushScales = [{group: "g.tasksGanttChartXBrush",
                            scale: xBrushScale,
                            type: "x",
                            height: brushHeight - yPadding}];
        var tasksRectsData = [];
        var linesData = [];
        var labelsData = [];
        var brushRectsData = [];
        brushRectsData.push({cls:"tasksGanttChartBrushBackgroundRect tasksGanttChartBrushRect",
                            x: 0,
                            y: 0,
                            ry: 0,
                            ry: 0,
                            width: canvasWidth,
                            height: brushHeight - yPadding,
                            fill: "" });
        for (var i = 0; i < sortedTasks.length; i++) {
            linesData.push({ x1: xOffset,
                             y1: y(i) + yOffset,
                             x2: canvasWidth + xOffset,
                             y2: y(i) + yOffset,
                             cls: "tasksGanttChartLaneLine tasksGanttChartLine" });
            labelsData.push({ x: 0,
                              y: yOffset + y(i) + (laneMaxHeight / 2) + (fontSize / 2),
                              label: sortedTasks[i].name,
                              cls: "tasksGanttChartLabel" });
            tasksRectsData.push({ x: x(sortedTasks[i].from),
                                  y: y(i) + ((laneMaxHeight - barMaxHeight) / 2),
                                  rx: 6,
                                  ry: 6,
                                  width: x(sortedTasks[i].to) - x(sortedTasks[i].from),
                                  height: barMaxHeight - ((barMaxHeight/16) * 2),
                                  taskId: sortedTasks[i].taskId,
                                  color: sortedTasks[i].color,
                                  cls: "tasksGanttChartTaskRect" }); 
            brushRectsData.push({ x: x(sortedTasks[i].from),
                                  y: brushY(i),
                                  rx: 3,
                                  ry: 3,
                                  width: x(sortedTasks[i].to) - x(sortedTasks[i].from),
                                  height: (brushHeight - yPadding) / sortedTasks.length,
                                  color: sortedTasks[i].color,
                                  cls: "tasksGanttChartBrushTaskRect tasksGanttChartBrushRect" }); 
        }
        linesData.push({ x1: xOffset,
                         y1: yOffset,
                         x2: xOffset,
                         y2: canvasHeight + yOffset,
                         cls: "tasksGanttChartCanvasLine tasksGanttChartLine" });
        linesData.push({ x1: canvasWidth + xOffset,
                         y1: yOffset,
                         x2: canvasWidth + xOffset,
                         y2: canvasHeight + yOffset,
                         cls:  "tasksGanttChartCanvasLine tasksGanttChartLine" });
        linesData.push({ x1: xOffset,
                         y1: yOffset,
                         x2: canvasWidth + xOffset,
                         y2: yOffset,
                         cls: "tasksGanttChartCanvasLine tasksGanttChartLine" });
        linesData.push({ x1: xOffset,
                         y1: canvasHeight + yOffset,
                         x2: canvasWidth + xOffset,
                         y2: canvasHeight + yOffset,
                         cls: "tasksGanttChartCanvasLine tasksGanttChartLine" });
        labelsData.push({ x: xOffset + canvasWidth - (fontSize * 4),
                          y: yPadding + fontSize,
                          label: "(time)",
                          cls: "tasksGanttChartLabel"});
        labelsData.push({ x: xOffset + canvasWidth - (fontSize * 4),
                          y: yOffset + canvasHeight + axisHeight - yPadding,
                          label: "(time)",
                          cls: "tasksGanttChartLabel"});
        labelsData.push({ x: 0,
                          y: yOffset - yPadding,
                          label: "(tasks)",
                          cls: "tasksGanttChartLabel" });

        var containers = _tcDrawCreateContainers(self,
                                                 "div.tasksGanttChart",
                                                 commonData.containers);
        var scrollButtons = _tcDrawCreateScrollButtons(self,
                                                       "div.tasksGanttChart",
                                                       commonData.scrolls);
        var prevNextInputs = _tcDrawCreatePrevNextInputs(self,
                                                           "div.tasksGanttChart",
                                                           source.settings.tasksGanttChart.start,
                                                           source.settings.tasksGanttChart.step,
                                                           function() {
                                                               source.settings.tasksGanttChart.start = 0; 
                                                               source.settings.tasksGanttChart.step = commonData.tasks.length; 
                                                               _tcDrawTasksGanttChart(self, source, onTaskClick, null);
                                                           },
                                                           function() {
                                                               source.settings.tasksGanttChart.start -= source.settings.tasksGanttChart.step;
                                                               if (source.settings.tasksGanttChart.start < 0) {
                                                                   source.settings.tasksGanttChart.start = 0;
                                                               }
                                                               _tcDrawTasksGanttChart(self, source, onTaskClick, null);
                                                           },
                                                           function(target, event) {
                                                               var start = parseInt(event.target.value) - 1;
                                                               if (typeof start === "number" && !isNaN(start) && start >= 0) {
                                                                   source.settings.tasksGanttChart.start = start;
                                                               }
                                                               _tcDrawTasksGanttChart(self, source, onTaskClick, null);
                                                           },
                                                           function(target, event) {
                                                               var step = parseInt(event.target.value);
                                                               if (typeof step === "number" && !isNaN(step) && step >= 0) {
                                                                   source.settings.tasksGanttChart.step = step;
                                                               }
                                                               _tcDrawTasksGanttChart(self, source, onTaskClick, null);
                                                           },
                                                           function() {
                                                               if (source.settings.tasksGanttChart.start + source.settings.tasksGanttChart.step <= commonData.tasks.length - 1) {
                                                                   source.settings.tasksGanttChart.start += source.settings.tasksGanttChart.step;
                                                               }
                                                               _tcDrawTasksGanttChart(self, source, onTaskClick, null);
                                                           });
        var topSvg = _tcDrawCreateTopSvg(self,
                                         "div.tasksGanttChart",
                                         topSvgData);
        var subSvgs = _tcDrawCreateSubSvgs(topSvg,
                                           "svg.tasksGanttChartSubSvg",
                                           subSvgsData);
        var tasksRects = _tcDrawCreateTasksRects(topSvg,
                                                 "svg.tasksGanttChartRectsSvg",
                                                 "tasksGanttChartTaskRect",
                                                 tasksRectsData,
                                                 source,
                                                 onTaskClick);
        var lines = _tcDrawCreateLines(topSvg,
                                       "svg.tasksGanttChartLinesSvg",
                                       "line.tasksGanttChartLine",
                                       linesData);
        var labels = _tcDrawCreateLabels(topSvg,
                                         "svg.tasksGanttChartLabelsSvg",
                                         "text.tasksGanttChartLabel",
                                         labelsData,
                                         fontSize);
        var axis = _tcDrawCreateAxis(topSvg,
                                     "svg.tasksGanttChartAxisSvg",
                                     "g.tasksGanttChartAxis",
                                     axisData,
                                     axisScales,
                                     fontSize);
        var brushRects = _tcDrawCreateBrushRects(topSvg,
                                                  "svg.tasksGanttChartBrushSvg",
                                                  "rect.tasksGanttChartBrushRect",
                                                   brushRectsData);
        var brush = _tcDrawCreateBrush(topSvg,
                                       "svg.tasksGanttChartBrushSvg",
                                       "g.tasksGanttChartBrush",
                                       brushData,
                                       brushScales);
    }

    var _tcDrawTasksBarChart = function(self, source, onTaskClick, commonData) {
        if (!source.settings.drawTasksBarChart) {
            return;
        }
        // get need param
        if (commonData == null) {
            commonData = _tcGetCommonData(source);
        }
        var maxNameLen = 0;
        for (var i = 0; i < commonData.tasks.length; i++) {
            var len = _tcGetStringLength(commonData.tasks[i].name);
            if (maxNameLen < len) {
                maxNameLen = len;
            }
        }
        // sort
        var sortedTasks =  d3.values(commonData.tasks).sort(function(a, b){ return d3.descending(a.elapse, b.elapse); });
        var head = source.settings.tasksBarChart.head;
        var tail = source.settings.tasksBarChart.tail;
        var snipdot = {
            taskId: null,
            name: "　.",
            elapse: 0, 
            taskId: null,
            clickEventArg: null,
            color: "#000000"
        };
        var snip = {
            taskId: null,
            name: "(snip)",
            elapse: 0, 
            taskId: null,
            clickEventArg: null,
            color: "#000000"
        };
        if (sortedTasks.length > head + tail) {
		sortedTasks.splice(head, sortedTasks.length - (head + tail), snipdot, snipdot, snipdot, snip, snipdot, snipdot, snipdot);
        }
        // defines
        var brushEndCb = function() {
            var extent = d3.event.target.extent();
            source.settings.tasksBarChart.viewRange.from = extent[0];
            source.settings.tasksBarChart.viewRange.to = extent[1];
            _tcDrawTasksBarChart(self, source, onTaskClick, null);
        }
        var fontSize = source.settings.fontSize;
        var yPadding = 8;
        var xOffset = ((maxNameLen * fontSize)/1.8) + fontSize + yPadding;
        var axisHeight = 8 + fontSize + yPadding + fontSize + yPadding; 
        var yOffset = axisHeight;
        var brushHeight = source.settings.brushHeight + yPadding;
        var barMaxHeight = source.settings.tasksBarChart.barMaxHeight;
        var canvasHeight = barMaxHeight * sortedTasks.length; 
        var canvasWidth = source.settings.width - xOffset;
        var svgHeight = yOffset + canvasHeight + axisHeight + brushHeight + 20;
        var svgWidth = xOffset + canvasWidth;
        var xmax = commonData.elapseMax
        var brushFromTo = _tcAdjustBlushValue(source.settings.tasksBarChart.viewRange.from,
                                              source.settings.tasksBarChart.viewRange.to,
                                              0,
                                              xmax);
        var zoom = xmax / (brushFromTo[1] - brushFromTo[0]);
        if ((brushFromTo[1] - brushFromTo[0]) == 0) {
           zoom = 1;
        }
        
        var x = d3.scale.linear()
                        .domain([0, xmax])
                        .range([0, canvasWidth]);
        var axisX = d3.scale.linear()
                             .domain([0, xmax])
                             .range([0, canvasWidth * zoom]);
        var y = d3.scale.linear()
                        .domain([0, 1])
                        .range([0, barMaxHeight]);
        var brushY = d3.scale.linear()
                              .domain([0, sortedTasks.length])
                              .range([0, brushHeight - yPadding]);
        var xAxisTop = d3.svg.axis()
                             .scale(axisX)
                             .orient("top")
                             .ticks((canvasWidth / commonData.tickWidth) * zoom)
                             .tickSize(8, 4, 2)
                             .tickFormat(function(d) { return _tcElapsedTimeFormat(d, brushFromTo); })
        var xAxisBottom = d3.svg.axis()
                                .scale(axisX)
                                .orient("bottom")
                                .ticks((canvasWidth / commonData.tickWidth) * zoom)
                                .tickSize(8, 4, 2)
                                .tickFormat(function(d) { return _tcElapsedTimeFormat(d, brushFromTo); })
        var xBrushScale = d3.svg.brush().x(x)
                                        .on("brushend", brushEndCb)
                                        .extent(_tcGetBrushExtent(source.settings.tasksBarChart.viewRange, 0, xmax));
        // convert data
        var topSvgData = [{cls: "tasksBarChartSvg",
                           width: svgWidth,
                           height: svgHeight,
                           viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + svgHeight }];
        var subSvgsData = [{cls: "tasksBarChartRectsSvg tasksBarChartSubSvg",
                            x: xOffset,
                            y: yOffset,
                            width: canvasWidth,
                            height: canvasHeight,
                            preserveAspectRatio: "none",
                            viewBox: "" + x(brushFromTo[0]) + " " + 0 + " " + (canvasWidth / zoom) + " " + canvasHeight },
                           {cls: "tasksBarChartAxisSvg tasksBarChartSubSvg",
                            x: xOffset,
                            y: 0,
                            preserveAspectRatio: "xMidYMid",
                            width: canvasWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            viewBox: "" + axisX(brushFromTo[0]) + " " + 0 + " " + canvasWidth + " " + (yOffset +canvasHeight + axisHeight) },
                           {cls: "tasksBarChartLinesSvg tasksBarChartSubSvg",
                            x: 0,
                            y: 0,
                            width: svgWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + (yOffset + canvasHeight + axisHeight) },
                           {cls: "tasksBarChartLabelsSvg tasksBarChartSubSvg",
                            x: 0,
                            y: 0,
                            width: svgWidth,
                            height: yOffset + canvasHeight + axisHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + svgWidth + " " + (yOffset + canvasHeight + axisHeight) },
                           {cls: "tasksBarChartBrushSvg tasksBarChartSubSvg",
                            x: xOffset,
                            y: yOffset + canvasHeight + axisHeight,
                            width: canvasWidth,
                            height: brushHeight,
                            preserveAspectRatio: "xMidYMid",
                            viewBox: "" + 0 + " " + 0 + " " + canvasWidth + " " + brushHeight }];
        var axisData = [{trans: "translate(0, " + yOffset + ")" ,
                         cls: "tasksBarChartXAxisTop tasksBarChartAxis",
                         scale: "x"},
                        {trans: "translate(0, " + (yOffset + canvasHeight) + ")" ,
                         cls: "tasksBarChartXAxisBottom tasksBarChartAxis",
                         scale: "x"}];
        var axisScales = [{group: "g.tasksBarChartXAxisTop",
                           scale: xAxisTop},
                          {group: "g.tasksBarChartXAxisBottom",
                           scale: xAxisBottom}];
        var brushData = [{cls:"tasksBarChartXBrush tasksBarChartBrush"}];
        var brushScales = [{group: "g.tasksBarChartXBrush",
                            scale: xBrushScale,
                            type: "x",
                            height: brushHeight - yPadding}];
        var tasksRectsData = [];
        var linesData = [];
        var labelsData = [];
        var brushRectsData = [];
        brushRectsData.push({cls:"tasksBarChartBrushBackgroundRect tasksBarChartBrushRect",
                            x: 0,
                            y: 0,
                            ry: 0,
                            ry: 0,
                            width: canvasWidth,
                            height: brushHeight - yPadding,
                            fill: "" });
        for (var i = 0; i < sortedTasks.length; i++) {
            linesData.push({ x1: xOffset,
                             y1: y(i) + yOffset,
                             x2: canvasWidth + xOffset,
                             y2: y(i) + yOffset,
                             cls: "tasksBarChartLaneLine tasksBarChartLine" });
            labelsData.push({ x: 0,
                              y: yOffset + y(i) + (barMaxHeight / 2) + (fontSize / 2),
                              label: sortedTasks[i].name,
                              cls: "tasksBarChartLabel" });
            tasksRectsData.push({ x: x(0),
                                  y: y(i) + (barMaxHeight/16),
                                  rx: 6,
                                  ry: 6,
                                  width: x(sortedTasks[i].elapse) - x(0),
                                  height: barMaxHeight - ((barMaxHeight/16) * 2),
                                  taskId: sortedTasks[i].taskId,
                                  color: sortedTasks[i].color,
                                  cls: "tasksBarChartTaskRect" }); 
            brushRectsData.push({ x: x(0),
                                  y: brushY(i),
                                  rx: 3,
                                  ry: 3,
                                  width: x(sortedTasks[i].elapse) - x(0),
                                  height: (brushHeight - yPadding) / sortedTasks.length,
                                  color: sortedTasks[i].color,
                                  cls: "tasksBarChartBrushTaskRect tasksBarChartBrushRect" }); 
        }
        linesData.push({ x1: xOffset,
                         y1: yOffset,
                         x2: xOffset,
                         y2: canvasHeight + yOffset,
                         cls: "tasksBarChartCanvasLine tasksBarChartLine" });
        linesData.push({ x1: canvasWidth + xOffset,
                         y1: yOffset,
                         x2: canvasWidth + xOffset,
                         y2: canvasHeight + yOffset,
                         cls:  "tasksBarChartCanvasLine tasksBarChartLine" });
        linesData.push({ x1: xOffset,
                         y1: yOffset,
                         x2: canvasWidth + xOffset,
                         y2: yOffset,
                         cls: "tasksBarChartCanvasLine tasksBarChartLine" });
        linesData.push({ x1: xOffset,
                         y1: canvasHeight + yOffset,
                         x2: canvasWidth + xOffset,
                         y2: canvasHeight + yOffset,
                         cls: "tasksBarChartCanvasLine tasksBarChartLine" });
        labelsData.push({ x: xOffset + canvasWidth - (fontSize * 4),
                          y: yPadding + fontSize,
                          label: "(time)",
                          cls: "tasksBarChartLabel"});
        labelsData.push({ x: xOffset + canvasWidth - (fontSize * 4),
                          y: yOffset + canvasHeight + axisHeight - yPadding,
                          label: "(time)",
                          cls: "tasksBarChartLabel"});
        labelsData.push({ x: 0,
                          y: yOffset - yPadding,
                          label: "(tasks)",
                          cls: "tasksBarChartLabel" });

        var containers = _tcDrawCreateContainers(self,
                                                 "div.tasksBarChart",
                                                 commonData.containers);
        var scrollButtons = _tcDrawCreateScrollButtons(self,
                                                       "div.tasksBarChart",
                                                       commonData.scrolls);
        var headTailInputs = _tcDrawCreateHeadTailInputs(self,
                                                         "div.tasksBarChart",
                                                         source.settings.tasksBarChart.head,
                                                         source.settings.tasksBarChart.tail,
                                                         function() {
                                                             source.settings.tasksBarChart.head = commonData.tasks.length;
                                                             source.settings.tasksBarChart.tail = 0;
                                                             _tcDrawTasksBarChart(self, source, onTaskClick, null);
                                                         },
                                                         function(target, event) {
                                                             var head = parseInt(event.target.value);
                                                             if (typeof head === "number" && !isNaN(head) && head >= 0) {
                                                                 source.settings.tasksBarChart.head = head;
                                                             }
                                                             _tcDrawTasksBarChart(self, source, onTaskClick, null);
                                                         },
                                                         function(target, event) {
                                                             var tail = parseInt(event.target.value);
                                                             if (typeof tail === "number" && !isNaN(tail) && tail >= 0) {
                                                                 source.settings.tasksBarChart.tail = tail;
                                                             }
                                                             _tcDrawTasksBarChart(self, source, onTaskClick, null);
                                                         });
        var topSvg = _tcDrawCreateTopSvg(self,
                                         "div.tasksBarChart",
                                         topSvgData);
        var subSvgs = _tcDrawCreateSubSvgs(topSvg,
                                           "svg.tasksBarChartSubSvg",
                                           subSvgsData);
        var tasksRects = _tcDrawCreateTasksRects(topSvg,
                                                 "svg.tasksBarChartRectsSvg",
                                                 "tasksBarChartTaskRect",
                                                 tasksRectsData,
                                                 source,
                                                 onTaskClick);
        var lines = _tcDrawCreateLines(topSvg,
                                       "svg.tasksBarChartLinesSvg",
                                       "line.tasksBarChartLine",
                                       linesData);
        var labels = _tcDrawCreateLabels(topSvg,
                                         "svg.tasksBarChartLabelsSvg",
                                         "text.tasksBarChartLabel",
                                         labelsData,
                                         fontSize);
        var axis = _tcDrawCreateAxis(topSvg,
                                     "svg.tasksBarChartAxisSvg",
                                     "g.tasksBarChartAxis",
                                     axisData,
                                     axisScales,
                                     fontSize);
        var brushRects = _tcDrawCreateBrushRects(topSvg,
                                                  "svg.tasksBarChartBrushSvg",
                                                  "rect.tasksBarChartBrushRect",
                                                   brushRectsData);
        var brush = _tcDrawCreateBrush(topSvg,
                                       "svg.tasksBarChartBrushSvg",
                                       "g.tasksBarChartBrush",
                                       brushData,
                                       brushScales);
    }

    var _tcDraw = function(self, source, onTaskClick) {
        if (source.tasks == null) {
            return;
        }

        // getCommonData
        var commonData = _tcGetCommonData(source);

        // check tasks
        if (commonData.tasks.length == 0) {
            return;
        }

        // datepicket Containers
        var datePickerContainers = d3.selectAll(self)
                                     .selectAll("span.datePickerContainer")
                                     .data(commonData.datePickerContainersData);
        datePickerContainers.enter()
                                .append("span")
                                .text(function (d) { return d.label})
                                .attr("class", function(d) { return d.cls })
        datePickerContainers.exit().remove();

        // datePickers
        for (var i = 0; i < commonData.datePickersData.length; i++) {
            var datePicker = d3.selectAll(self)
                               .selectAll(commonData.datePickersData[i].span)
                               .selectAll("input")
                               .data(commonData.datePickersData[i].data)
            datePicker.enter()
                          .append("input")
                          .attr("type", "text")
                          .attr("class", function(d) { return d.cls });
            datePicker.exit().remove()
        }
        var startDatePicker = $(".startDatePicker").datepicker({ onSelect: function() {
                                  source.settings.startDate = Date.parse($(this).val());
                                  _tcDraw(self, source, onTaskClick);
                              }});
        var startDate = new Date(source.settings.startDate);
        startDatePicker.datepicker("option", "dateFormat", "yy-mm-dd")
        startDatePicker.datepicker("option", "minDate", new Date(commonData.startDateMin))
        startDatePicker.datepicker("option", "maxDate", new Date(commonData.endDateMax))
        startDatePicker.val(startDate.getFullYear() + "-" + _tcTFPad((startDate.getMonth() + 1), 2) + "-" + _tcTFPad(startDate.getDate(), 2))

        var endDatePicker = $(".endDatePicker").datepicker({ onSelect: function() {
                                  source.settings.endDate = Date.parse($(this).val());
                                  _tcDraw(self, source, onTaskClick);
                            }});
        var endDate = new Date(source.settings.endDate);
        endDatePicker.datepicker("option", "dateFormat", "yy-mm-dd")
        endDatePicker.datepicker("option", "minDate", new Date(commonData.startDateMin))
        endDatePicker.datepicker("option", "maxDate", new Date(commonData.endDateMax))
        endDatePicker.val(endDate.getFullYear() + "-" + _tcTFPad((endDate.getMonth() + 1), 2) + "-" + _tcTFPad(endDate.getDate(), 2))

        // create svg divs
        var containers = []
        if (source.actors != null) {
		if (source.settings.drawActorsSummaryBarChart) {
		    containers.push("actorsSummaryBarChart chartContainer");
		} else if (source.settings.drawActorsSwimlaneChart){
		    containers.push("actorsSwimlaneChart chartContainer");
		}
	}
	containers.push("tasksGanttChart chartContainer");
	containers.push("tasksBarChart chartContainer");

        var topDivs = d3.selectAll(self)
                        .selectAll("div.chartContainer")
                        .data(containers)
        topDivs.attr("class", function(d) { return d });
        topDivs.enter()
                   .append("div")
                   .attr("class", function(d) { return d });
        topDivs.exit().remove();

        // draw charts
        if (source.actors != null) {
		if (source.settings.drawActorsSummaryBarChart) {
			_tcDrawActorsSummaryBarChart(self, source, onTaskClick, commonData);
		} else if (source.settings.drawActorsSwimlaneChart) {
			_tcDrawActorsSwimlaneChart(self, source, onTaskClick, commonData);
		}
	}
        _tcDrawTasksGanttChart(self, source, onTaskClick, commonData);
        _tcDrawTasksBarChart(self, source, onTaskClick, commonData);
    };

    var _tcRemove = function(self, data) {
        d3.selectAll(self).selectAll("div")
              .data([])
              .exit()
              .remove();
    };

    var _tcDataUpdate = function(data, source) {
        source.settings.startDate = null;
        if ("settings" in source) {
            $.extend(true, data.source.settings, source.settings);
        }
        if ("actors" in source) {
            data.source.actors = source.actors;
        }
        if ("tasks" in source) {
            data.source.tasks = source.tasks;
        }
    }

    var _tcAjax = function(self, data) {
        $.ajax(data.ajaxParams).done(function(source) {
            _tcDataUpdate(data, source);
            _tcDraw(self, data.source, data.onTaskClick);
        }) 
    }

    var _tcAjaxTimer = function(self, data) {
        if (data.ajaxPending) {
            if (data.ajaxTimerId != null) {
                clearInterval(data.ajaxTimerId);
                data.ajaxTimerId = null;
            }
        } else {
            if (data.ajaxTimerId == null) {
                data.ajaxTimerId = setInterval(function(){_tcAjax(self, data)();}, data.ajaxInterval);
            }
            _tcAjax(self, data);
        }
    }

    var _tcDrawPrepare = function(self, data) {
        if (data.source.actors || data.source.tasks) {
            _tcDraw(self, data.source, data.onTaskClick);
        } else if (data.ajax != null && typeof data.ajax == "object" && typeof data.ajaxInterval == "number") {
            _tcAjaxTimer(self, data)
        } else if (data.ajax != null && typeof data.ajax == "object") {
            _tcAjax(self, data);
        }
    }

    var _tcRemovePrepare = function(self, data) {
        if (data.ajaxTimerId != null) {
            clearInterval(data.ajaxTimerId);
            data.ajaxTimerId = null;
        }
        _tcRemove(self, data.source);
    }

    var tchart = {
        init: function(options) {
            var data = this.data('tchart');
            if (!data) {
                this.data('tchart',
                    $.extend(true, {
                        ajaxTimerId: null,
                        ajaxParams: null,
                        ajaxInterval: null,
                        ajaxPending: false,
                        onTaskClick: null,
                        source: {
                            settings : {
                                drawActorsSummaryBarChart: true,
                                drawActorsSwimlaneChart: true,
                                drawTasksGanttChart: true,
                                drawTasksBarChart: true,
                                fontSize: 12,
                                width: 500,
                                actorsSummaryBarChart : {
                                    label: "actors summary bar chart",
                                    barMaxHeight: 16,
                                    viewRange: {
                                         from: null,
                                         to: null
                                    }
                                },
                                actorsSwimlaneChart : {
                                    label: "actors swimlane chart",
                                    barMaxHeight:14,
                                    viewRange: {
                                         from: null,
                                         to: null
                                    }
                                },
                                tasksGanttChart : {
                                    start: 0,
                                    step: 50,
                                    label: "tasks gantt chart",
                                    barMaxHeight: 14,
                                    laneMaxHeight:16,
                                    viewRange: {
                                         from: null,
                                         to: null
                                    }
                                },
                                tasksBarChart : {
                                    head: 20,
                                    tail: 20,
                                    label: "tasks bar chart",
                                    barMaxHeight: 16,
                                    viewRange: {
                                         from: null,
                                         to: null
                                    }
                                },
                                startTime: null,
                                brushHeight: 30,
                                startDate: null,
                                endDate: null
                            },
                            actors: null,
                            tasks: null
                        },
                    }, options));
                data = this.data('tchart');
            }
            _tcDrawPrepare(this, data);
            return this;
        },
        update: function(source) {
            var data = this.data('tchart');
            if (!data) {
                return this;
            }
            _tcDataUpdate(data, source);
            _tcDraw(this, data.source, data.onTaskClick);
            return this;
        },
        remove: function() {
            var data = this.data('tchart');
            if (!data) {
                return this;
            }
            _tcRemovePrepare(this, data.source);
            return this;
        },
        pendingAjax: function(source) {
            var data = this.data('tchart');
            if (!data) {
                return this;
            }
            data.ajaxPending = true;
            _tcAjaxTimer(this, data);
            return this;
        },
        resumeAjax: function(source) {
            var data = this.data('tchart');
            if (!data) {
                return this;
            }
            data.ajaxResume = true;
            _tcAjaxTimer(this, data);
            return this;
        }
    }

    $.fn.tchart = function(method) {
        if (tchart[method]) {
            return tchart[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return tchart.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.tchart');
        }  
        return this;
    }
})(jQuery);

//////////////////////////////////////////////////////////////////////////
//
// * initizlize
//      
//     usage: 
//        $(target).tchart([options])
//
//     option:
//         ajaxParams: jquery ajax param
//         ajaxInterval: ajax polling interval [ Number (milliseconds) ]
//         onTaskClick: task click event callback [ function ]
//      
// * remove chart    
//     
//     usage: 
//        $(target).tchart("remove")
//
// * update chart    
//     
//     usage: 
//        $(target).tchart("update", source)
//
//     source: 
//         {
//             settings: {
//                 drawActorsSummaryBarChart: boolean,
//                 drawActorsSwimlaneChart: boolane,
//                 drawTasksGanttChart: boolane,
//                 drawTasksBarChart: boolane,
//                 fontSize: Number,
//                 width: Number,
//                 actorsSwimlaneChart : {
//                     barMaxHeight: Number
//                 },
//                 tasksGanttChart : {
//                     barMaxHeight: Number,
//                     laneMaxHeight: Number
//                 },
//                 tasksBarChart : {
//                     barMaxHeight: Number, 
//                 },
//                 startTime: Number (millisecond) or null,
//                 brushHeight: Number
//             },
//             actors : {
//                 actorId1 : {
//                     name: string,
//                     tasks : [
//                         taskId1
//                     ]
//                 },
//                 actorId2 : {
//                     name: string,
//                     tasks : [
//                         taskId2
//                     ]
//                 }
//             },
//             tasks : {
//                 task_Id1: { 
//                     name: string,
//                     from: number (millisec time),
//                     to: number (millisec time),
//                     clickEventArg: object,
//                     nextTasks : [
//                         taskId2
//                     ]
//                 },
//                 task_Id2: { 
//                     name: string,
//                     from: number (millisec time),
//                     to: number (millisec time),
//                     clickEventArg: object,
//                     nextTasks : null
//                 }
//             }
//         }
//
// *  pending ajax polling   
//     
//     usage: 
//        $(target).tchart("pendingAjax")
//
// *  resume ajax polling   
//     
//     usage: 
//        $(target).tchart("resumeAjax")
//
