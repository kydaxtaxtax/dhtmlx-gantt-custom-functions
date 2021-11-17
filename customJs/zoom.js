Date.prototype.getWeek = function() // функция получения номера недели от объекта data
{
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

var zoomConfig = //Зум кнопки врчную
{
  levels: [
    /*
    {
      name:"day",
      scale_height: 27,
      min_column_width:80,
      scales:[
        {unit: "day", step: 1, format: "%d %M"}
      ]
    },*/

    {
      name:"week",
      scale_height: 50,
      min_column_width:80,
      scales:
      [
        {
          unit: "week", step: 1, format: function (date)
          {
            var dateToStr = gantt.date.date_to_str("%d %M");
            var endDate = gantt.date.add(date, -6, "day");
            var weekNum = gantt.date.date_to_str("%W неделя")(date);
            return weekNum + " (" + dateToStr(endDate) + " - " + dateToStr(date) + ")";
          }
        },

        {
          unit: "day", step: 1, format: function (date)
          {
            var weekNum = gantt.date.date_to_str("%j %D")(date); // Определяем выводимую строку

/*


            gantt.templates.scale_cell_class = function (date) // класс CSS, который будет применен к шапке шкалы времени
            {
            	if (date.getDay() == 0 || date.getDay() == 6)
              {
              	return "weekend";
              }
            };
*/
            gantt.templates.timeline_cell_class = function (item, date) // класс CSS, который будет применяться к ячейкам области шкалы времени
            {
            	if (date.getDay() == 0 || date.getDay() == 6)
              {
            		return "weekend";
            	}
            };

            return weekNum;
          }
        }
      ]
    },
    {
      name:"month",
      scale_height: 50,
      min_column_width:120,
      scales:
      [
        {unit: "month", format: "%F %Y"},
        {unit: "week", format: function (date)
          {
            var monthNum = gantt.date.date_to_str("%W")(date); // Определяем выводимую строку
/*
            gantt.templates.scale_cell_class = function (date) // класс CSS, который будет применен к шапке шкалы времени
            {
              if (date.getWeek() % 2)
              {
                return "weekend";
              }
            };
*/
            gantt.templates.timeline_cell_class = function (item, date) // класс CSS, который будет применяться к ячейкам области шкалы времени
            {
              if (date.getMonth() % 1)
              {
                return "none";
              }
            };

            return monthNum + " неделя";
          }
        }
      ]
    },
    {
      name:"quarter",
      height: 50,
      min_column_width:90,
      scales:[
        {unit: "year", step: 1, format: "%Y"},
        {unit: "month", step: 1, format: function (date)
          {
            var quarterNum = gantt.date.date_to_str("%F")(date); // Определяем выводимую строку
/*
            gantt.templates.scale_cell_class = function (date) // класс CSS, который будет применен к шапке шкалы времени
            {
              if (date.getMonth() % 2)
              {
                return "weekend";
              }
            };
*/
            gantt.templates.timeline_cell_class = function (item, date) // класс CSS, который будет применяться к ячейкам области шкалы времени
            {
              if (date.getMonth() % 1)
              {
                return "none";
              }
            };

            return quarterNum;
          }
        }
/*
        {
          unit: "quarter", step: 1, format: function (date)
          {
            var dateToStr = gantt.date.date_to_str("%M");
            var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
            return dateToStr(date) + " - " + dateToStr(endDate);
          }
        }
*/
      ]
    },
    {
      name:"year",
      scale_height: 50,
      min_column_width: 30,
      scales:[
        {unit: "year", step: 1, format: function (date)
          {
            var yearNum = gantt.date.date_to_str("%Y")(date); // Определяем выводимую строку
/*
            gantt.templates.scale_cell_class = function (date) // класс CSS, который будет применен к шапке шкалы времени
            {
              if (date.getWeek() % 2)
              {
                return "weekend";
              }
            };
*/
            gantt.templates.timeline_cell_class = function (item, date) // класс CSS, который будет применяться к ячейкам области шкалы времени
            {
              if (date.getMonth() % 1)
              {
                return "none";
              }
            };

            return yearNum;
          }
        }
      ]
    }
  ]
};

gantt.ext.zoom.init(zoomConfig);
gantt.ext.zoom.setLevel("year");


function zoomIn(){

  gantt.ext.zoom.zoomIn();
}
function zoomOut(){
  
  gantt.ext.zoom.zoomOut()
}

var radios = document.getElementsByName("scale");
for (var i = 0; i < radios.length; i++) {
  radios[i].onclick = function (event) {
    gantt.ext.zoom.setLevel(event.target.value);
  };
}



















			/* // Установка масштаба вручную
			var monthScaleTemplate = function (date) {
			  var dateToStr = gantt.date.date_to_str("%d");
			  var endDate = gantt.date.add(date, 6, "day");
			  return dateToStr(date) + " - " + dateToStr(endDate);
			};

			gantt.config.scales = [
			    {unit: "month", step: 1, format: "%F"},
			    {unit: "week", step: 1, format: monthScaleTemplate}
			];

			gantt.config.scale_height = 42;
			*/














			/*
			// зум на шапку колесиком мыши
			var hourToStr = gantt.date.date_to_str("%H:%i");
			var hourRangeFormat = function(step){
			  return function(date){
			    var intervalEnd = new Date(gantt.date.add(date, step, "hour") - 1)
			    return hourToStr(date) + " - " + hourToStr(intervalEnd);
			  };
			};



			var monthScaleTemplate = function (date) {
			  var dateToStr = gantt.date.date_to_str("%d");
			  var endDate = gantt.date.add(date, 6, "day");
			  return dateToStr(date) + " - " + dateToStr(endDate);
			};



			gantt.config.min_column_width = 80;
			var zoomConfig = {
			  minColumnWidth: 80,
			  maxColumnWidth: 150,
			  levels: [

			    [
			      {unit: "year", format: "%Y", step: 1},
			      {unit: "month", step: 3, format: "%F"}
			    ],
			    [
			      { unit: "month", format: "%M %Y", step: 1},
			      {unit: "week", step: 1, format: function (date)
			      {
			        var dateToStr = gantt.date.date_to_str("%j");
			        var endDate = gantt.date.add(date, 6, "day");
			        return dateToStr(date) + " - " + dateToStr(endDate);
			        }}
			    ],
			    [
			      { unit: "month", format: "%M %Y", step: 1},
			      { unit: "day", format: "%j %M", step: 1}
			    ],
			    [
			      { unit: "day", format: "%j %M", step: 1},
			      { unit: "hour", format: hourRangeFormat(12), step: 12}
			    ],
			    [
			      {unit: "day", format: "%j %M",step: 1},
			      {unit: "hour",format: hourRangeFormat(6),step: 6}
			    ],
			    [
			      { unit: "day", format: "%j %M", step: 1 },
			      { unit: "hour", format: "%H:%i", step: 1}
			    ]
			  ],
			  startDate: new Date(2018, 02, 27),
			  endDate: new Date(2018, 03, 20),
			  useKey: "ctrlKey",
			  trigger: "wheel",
			  element: function()
			  {
			    return gantt.$root.querySelector(".gantt_task");
			  }
			}

			gantt.ext.zoom.init(zoomConfig);*/
