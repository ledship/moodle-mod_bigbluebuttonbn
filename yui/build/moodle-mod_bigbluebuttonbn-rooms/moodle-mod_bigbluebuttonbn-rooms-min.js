YUI.add("moodle-mod_bigbluebuttonbn-rooms",function(e,t){M.mod_bigbluebuttonbn=M.mod_bigbluebuttonbn||{},M.mod_bigbluebuttonbn.rooms={data_source:null,polling:null,bigbluebuttonbn:{},panel:null,init:function(t){this.data_source=new e.DataSource.Get({source:M.cfg.wwwroot+"/mod/bigbluebuttonbn/bbb_broker.php?"}),this.bigbluebuttonbn=t,(this.bigbluebuttonbn.profile_features.includes("all")||this.bigbluebuttonbn.profile_features.includes("showroom"))&&this.init_room()},init_room:function(){if(this.bigbluebuttonbn.activity!=="open"){var t=[this.bigbluebuttonbn.locales.conference_ended];this.bigbluebuttonbn.activity!=="ended"&&(t.push(this.bigbluebuttonbn.opening),t.push(this.bigbluebuttonbn.closing)),e.DOM.addHTML(e.one("#status_bar"),this.init_status_bar(t));return}this.init_room_open()},init_room_open:function(){this.panel=new e.Panel({srcNode:"#panelContent",headerContent:this.bigbluebuttonbn.locales.modal_title,width:250,zIndex:5,centered:!0,modal:!0,visible:!1,render:!0,plugins:[e.Plugin.Drag]}),this.panel.addButton({value:this.bigbluebuttonbn.locales.modal_button,section:e.WidgetStdMod.FOOTER,action:function(t){t.preventDefault(),this.panel.hide();var n=e.one("#meeting_join_url"),r=e.one("#meeting_message"),i=e.one("#recording_name"),s=e.one("#recording_description"),o=e.one("#recording_tags"),u=i.get("value").replace(/</g,"&lt;").replace(/>/g,"&gt;"),a=s.get("value").replace(/</g,"&lt;").replace(/>/g,"&gt;"),f=o.get("value").replace(/</g,"&lt;").replace(/>/g,"&gt;"),l=n.get("value")+"&name="+u+"&description="+a+"&tags="+f;M.mod_bigbluebuttonbn.broker.executeJoin(l,r.get("value")),i.set("value",""),s.set("value",""),o.set("value",""),n.set("value",""),r.set("value","")}}),this.update_room()},update_room:function(){var t=e.one("#status_bar"),n=e.one("#control_panel"),r=e.one("#join_button"),i=e.one("#end_button"),s="action=meeting_info";s+="&id="+this.bigbluebuttonbn.meetingid,s+="&bigbluebuttonbn="+this.bigbluebuttonbn.bigbluebuttonbnid,this.data_source.sendRequest({request:s,callback:{success:function(s){e.DOM.addHTML(t,M.mod_bigbluebuttonbn.rooms.init_status_bar(s.data.status.message)),e.DOM.addHTML(n,M.mod_bigbluebuttonbn.rooms.init_control_panel(s.data)),typeof s.data.status.can_join!="undefined"&&e.DOM.addHTML(r,M.mod_bigbluebuttonbn.rooms.init_join_button(s.data.status)),typeof s.data.status.can_end!="undefined"&&s.data.status.can_end&&e.DOM.addHTML(i,M.mod_bigbluebuttonbn.rooms.init_end_button(s.data.status))}}})},init_status_bar:function(t){var n=e.DOM.create("<span>");if(t.constructor===Array)for(var r in t){if(!t.hasOwnProperty(r))continue;var i=e.DOM.create("<span>");e.DOM.setAttribute(i,"id","status_bar_span_span"),e.DOM.setText(i,t[r]),e.DOM.addHTML(n,i),e.DOM.addHTML(n,e.DOM.create("<br>"))}else e.DOM.setAttribute(n,"id","status_bar_span"),e.DOM.setText(n,t);return n},init_control_panel:function(t){var n=e.DOM.create("<div>");e.DOM.setAttribute(n,"id","control_panel_div");var r="";return t.running&&(r+=this.msg_started_at(t.info.startTime)+" ",r+=this.msg_attendees_in(t.info.moderatorCount,t.info.participantCount)),e.DOM.addHTML(n,r),n},msg_started_at:function(e){var t=parseInt(e,10)-parseInt(e,10)%1e3,n=new Date(t),r=n.getHours(),i=n.getMinutes(),s=M.mod_bigbluebuttonbn.rooms.bigbluebuttonbn.locales.started_at;return s+" <b>"+r+":"+(i<10?"0":"")+i+"</b>."},msg_attendees_in:function(e,t){if(typeof e=="undefined"&&typeof t=="undefined")return M.mod_bigbluebuttonbn.rooms.bigbluebuttonbn.locales.session_no_users+".";var n=t-e,r=M.mod_bigbluebuttonbn.rooms.bigbluebuttonbn.locales.session_has_users,i=M.mod_bigbluebuttonbn.rooms.bigbluebuttonbn.locales.moderators;e==1&&(i=M.mod_bigbluebuttonbn.rooms.bigbluebuttonbn.locales.moderator);var s=M.mod_bigbluebuttonbn.rooms.bigbluebuttonbn.locales.viewers;return e==1&&(s=M.mod_bigbluebuttonbn.rooms.bigbluebuttonbn.locales.viewer),t==1?n>0?r+" <b>1</b> "+s+".":r+" <b>1</b> "+i+".":r+" <b>"+e+"</b> "+i+" and <b>"+n+"</b> "+s+"."},init_join_button:function(t){var n=e.DOM.create("<input>");e.DOM.setAttribute(n,"id","join_button_input"),e.DOM.setAttribute(n,"type","button"),e.DOM.setAttribute(n,"value",t.join_button_text),e.DOM.setAttribute(n,"class","btn btn-primary");if(!t.can_join)return e.DOM.setAttribute(n,"disabled",!0),M.mod_bigbluebuttonbn.broker.waitModerator(t.join_url),n;var r="M.mod_bigbluebuttonbn.broker.join('";return r+=t.join_url+"', '"+M.mod_bigbluebuttonbn.rooms.bigbluebuttonbn.locales.in_progress,r+="', "+t.can_tag+");",e.DOM.setAttribute(n,"onclick",r),n},init_end_button:function(t){var n=e.DOM.create("<input>");return e.DOM.setAttribute(n,"id","end_button_input"),e.DOM.setAttribute(n,"type","button"),e.DOM.setAttribute(n,"value",t.end_button_text),e.DOM.setAttribute(n,"class","btn btn-secondary"),t.can_end&&e.DOM.setAttribute(n,"onclick","M.mod_bigbluebuttonbn.broker.endMeeting();"),n},remote_update:function(e){setTimeout(function(){M.mod_bigbluebuttonbn.rooms.clean_room(),M.mod_bigbluebuttonbn.rooms.update_room()},e)},clean_room:function(){this.clean_status_bar(),this.clean_control_panel(),this.clean_join_button(),this.clean_end_button()},clean_status_bar:function(){e.one("#status_bar_span").remove()},clean_control_panel:function(){e.one("#control_panel_div").remove()},clean_join_button:function(){e.one("#join_button").setContent("")},hide_join_button:function(){e.DOM.setStyle(e.one("#join_button"),"visibility","hidden")},show_join_button:function(){e.DOM.setStyle(e.one("#join_button"),"visibility","shown")},clean_end_button:function(){e.one("#end_button").setContent("")},hide_end_button:function(){e.DOM.setStyle(e.one("#end_button"),"visibility","hidden")},show_end_button:function(){e.DOM.setStyle(e.one("#end_button"),"visibility","shown")},window_close:function(){window.onunload=function(){opener.M.mod_bigbluebuttonbn.rooms.remote_update(5e3)},window.close()}}},"@VERSION@",{requires:["base","node","datasource-get","datasource-jsonschema","datasource-polling","moodle-core-notification"]});
