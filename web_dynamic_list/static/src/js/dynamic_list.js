odoo.define('web_dynamic_list.custom_adv_list_view', function (require) {
    "use strict";
    //    const { useService } = require("@web/core/utils/hooks");
    var core = require('web.core');
    var ListController = require('web.ListController');
    var QWeb = core.qweb;

    const { useState, useRef, useContext, useService } = owl.hooks;

    let enable_fields_type = ['char', 'integer', 'float', 'boolean', 'datetime', 'monetary', 'html', 'date', 'many2one', 'selection']
    ListController.include({
        renderButtons: function ($node) {
            var self = this;
            this._super.apply(this, arguments);
            this.$buttons.on('click', '.oe_select_columns', this.my_setup_columns.bind(this));
            this.$buttons.on('click', '.oe_dropdown_btn', this.hide_show_columns.bind(this));
            this.$buttons.on('click', '.oe_dropdown_menu', this.stop_event.bind(this));
            this.$buttons.on('click', '.search_filedsInfo', this.search_filedsInfo.bind(this));
            this.use_state = useState({ reload: false });
            //            this.orm = useService("orm");
            if (this.$buttons) {
                this.contents = this.$buttons.find('ul#show-menu');
                var columns = []
                let a = 0
                // load_view的所有列项
//                console.log('this.renderer.state.fields:', this.renderer.state.fields)
                // search_read里的fileds一样的数据，但结构不同
//                console.log('self.renderer.arch.children:', self.renderer.arch.children)
//                console.log('self.renderer.state.fieldsInfo:', self.renderer.state.fieldsInfo)
                _.each(this.renderer.state.fields, function (node) {
                    enable_fields_type.find(function (value) {
                        if (node.type === value) {
                            var name = node.name
                            // 找到中文
                            var description = node.string || self.renderer.state.fields[name].string;
                            // 通过load_view的所有列项找到arch里的child对应的结构
                            var arch_children = self.renderer.arch.children.filter(field => field.attrs.name === node.name)
                            if (arch_children === undefined || (Array.isArray(arch_children) && arch_children.length === 0)) {
                                var field_invisible = true
                                var modifiers = {
                                    'column_invisible': field_invisible
                                }
                            }
                            else {
                                arch_children = arch_children[0].attrs
                                if (arch_children.modifiers === undefined) {
                                    var field_invisible = true
                                    var modifiers = {
                                        'column_invisible': field_invisible
                                    }
                                }
                                else {
                                    var field_invisible = arch_children.modifiers.invisible || false
                                    var modifiers = arch_children.modifiers || {
                                        'column_invisible': arch_children.modifiers
                                    }
                                }
                            }
                            a++
                            columns.push({
                                'field_name': node.name,
                                'label': description,
                                'invisible': field_invisible,
                                'modifiers': modifiers,
                                'string': node.string,
                                'id': a
                            })
                        }
                    })
                })
                this.custom_columns = columns;
                this.contents.append($(QWeb.render('ColumnSelectionDropDown', {
                    widget: this,
                    columns: columns
                })));
                // 拖拽项
                setTimeout(() => {
                    const draggableId = document.getElementById('draggableId');
                    var draging = null;
                    //使用事件委托，将li的事件委托给ul
                    draggableId.ondragstart = function (event) {
                        //console.log("start");
                        //firefox设置了setData后元素才能拖动！！！！
                        //event.target出发事件的元素
                        event.dataTransfer.setData("te", event.target.innerText); //不能使用text，firefox会打开新tab
                        //event.dataTransfer.setData("self", event.target);
                        draging = event.target;
                    }
                    draggableId.ondragover = function (event) {
                        //console.log("onDrop over");
                        //取消默认行为
                        event.preventDefault();
                        var target = event.target;
                        //因为dragover会发生在ul上，所以要判断是不是li
                        if (target.nodeName === "LI") {
                            if (target !== draging) {
                                //getBoundingClientRect()用于获取某个元素相对于视窗的位置集合
                                var targetRect = target.getBoundingClientRect();
                                var dragingRect = draging.getBoundingClientRect();
                                if (target) {
                                    if (target.animated) {
                                        return;
                                    }
                                }
                                if (_index(draging) < _index(target)) {
                                    //nextSibling 属性可返回某个元素之后紧跟的节点（处于同一树层级中）。
                                    target.parentNode.insertBefore(draging, target.nextSibling);
                                } else {
                                    target.parentNode.insertBefore(draging, target);
                                }
                                _animate(dragingRect, draging);
                                _animate(targetRect, target);
                            }
                        }
                    }
                    //获取元素在父元素中的index
                    function _index(el) {
                        var index = 0;

                        if (!el || !el.parentNode) {
                            return -1;
                        }
                        //previousElementSibling属性返回指定元素的前一个兄弟元素（相同节点树层中的前一个元素节点）。
                        while (el && (el = el.previousElementSibling)) {
                            //console.log(el);
                            index++;
                        }

                        return index;
                    }

                    function _animate(prevRect, target) {
                        var ms = 300;

                        if (ms) {
                            var currentRect = target.getBoundingClientRect();
                            //nodeType 属性返回以数字值返回指定节点的节点类型。1=元素节点  2=属性节点
                            if (prevRect.nodeType === 1) {
                                prevRect = prevRect.getBoundingClientRect();
                            }
                            _css(target, 'transition', 'none');
                            _css(target, 'transform', 'translate3d(' +
                                (prevRect.left - currentRect.left) + 'px,' +
                                (prevRect.top - currentRect.top) + 'px,0)'
                            );

                            target.offsetWidth; // 触发重绘
                            //放在timeout里面也可以
                            // setTimeout(function() {
                            //     _css(target, 'transition', 'all ' + ms + 'ms');
                            //     _css(target, 'transform', 'translate3d(0,0,0)');
                            // }, 0);
                            _css(target, 'transition', 'all ' + ms + 'ms');
                            _css(target, 'transform', 'translate3d(0,0,0)');

                            clearTimeout(target.animated);
                            target.animated = setTimeout(function () {
                                _css(target, 'transition', '');
                                _css(target, 'transform', '');
                                target.animated = false;
                            }, ms);
                        }
                    }
                    //给元素添加style
                    function _css(el, prop, val) {
                        var style = el && el.style;

                        if (style) {
                            if (val === void 0) {
                                //使用DefaultView属性可以指定打开窗体时所用的视图
                                if (document.defaultView && document.defaultView.getComputedStyle) {
                                    val = document.defaultView.getComputedStyle(el, '');
                                } else if (el.currentStyle) {
                                    val = el.currentStyle;
                                }

                                return prop === void 0 ? val : val[prop];
                            } else {
                                if (!(prop in style)) {
                                    prop = '-webkit-' + prop;
                                }

                                style[prop] = val + (typeof val === 'string' ? '' : 'px');
                            }
                        }
                    }
                }, 300);
            }
            else {
                this.custom_columns = []
            }
        },

        my_setup_columns: function () {
            $("#show-menu").show();
        },

        stop_event: function (e) {
            e.stopPropagation();
        },

        hide_show_columns: function () {
            $("#show-menu").hide();
            var self = this;
            this.setup_columns()
            self.reload();
        },

        setup_fields_info: function () {
            var self = this;
            // 遍历当前渲染的下拉选项li
            _.each(this.contents.find('li.item_column'), function (item) {
                var checkbox_item = $(item).find('input');
                // 通过name匹配到选项行的数据结构field
                var field = _.find(self.renderer.state.fields, function (field) {
                    return field.name === checkbox_item[0].dataset['name']
                });
                let search_key = checkbox_item[0].dataset['name']
                if (search_key in self.renderer.state.fieldsInfo.list) {
                } else {
                    if ($(checkbox_item).is(':checked')) {
                        self.renderer.state.fieldsInfo.list[field.name] = {
                            name: field.name,
                            options: {},
                            type: field.type
                        }
                    }
                }
            })
            // console.log('self.renderer.arch.children:', self.renderer.arch.children)
        },

        // 插入table列
        setup_columns: function () {
            var self = this;
            this.setup_fields_info()
            self.renderer.arch.children = []
            _.each(this.contents.find('li.item_column'), function (item) {
                var checkbox_item = $(item).find('input');
                var field = _.find(self.custom_columns, function (field) {
                    return field.field_name === checkbox_item[0].dataset['name']
                });
                if ($(checkbox_item).is(':checked')) {
                    self.renderer.arch.children.push({
                        'attrs': {
                            'modifiers': field.modifiers,
                            'name': field.field_name,
                            'string': field.string,
                            'readonly': 1
                        },
                        'tag': 'field',
                        'children': [],
                        'options': {}
                    })
                    field.modifiers.column_invisible = false;
                } else {
                    field.modifiers.column_invisible = true;
                }
            })
            // console.log(self.renderer.arch.children)
        },

        // 搜索列项
        search_filedsInfo: function () {
            var self = this;
            const sv = $('.search_option_value').val()
            _.each(this.contents.find('li.item_column'), function (item) {
                var checkbox_item = $(item).find('input');
                var field = _.find(self.custom_columns, function (field) {
                    return field.field_name === checkbox_item[0].dataset['name']
                });
                if (field.string.includes(sv)) {
                    $(item).css('display', 'flex')
                } else {
                    $(item).css('display', 'none')
                }
            })
        }
    });

    $(document).click(function () {
        $('.oe_select_columns').click(function () {
            $("#show-menu").show();
        });
        $("#show-menu").hide();
    });

});
