//Script to print table.
//Thank God for Palak

$(document).ready(function() {
   jQuery('#wrapper').val("");
      var params = {
         query: jQuery('#schedule_table').val()
      };
      $.getJSON("/viewSchedule", params, function(result) {
         $.each(result, function(key, val) {
            var th = $('<tr></tr>');
            var tr = $('<tr></tr>');
            $.each(val, function(k, v) {
               if(key == 0) {
                  $('<th>'+k+'</th>').appendTo(th);
               }
               $('<td>'+v+'</td>').appendTo(tr);
            });
            th.appendTo('#display');
            tr.appendTo('#display');
         });
      });

});
