

function contentOfDays(startD, endD, dateS, dateE, fact) // колличество дней нагрузки в указанный период
{


  /*
  switch (gantt.ext.zoom.getCurrentLevel())//уровень зума
  {
    case 0: //дни
      var period = 1;
      break;

    case 1: //недели
      var period = 6;
      break;

    case 2: //месяца

      var period = dateS.daysInMonth();
      break;

    case 3: //года
      var period = daysInYear(dateS.getFullYear());
      break;
  }*/


  //var dateE = addDays(dateS, period);

  var result = 0;

  var sD = startD.valueOf();
  var eD = endD.valueOf();
  var dS = dateS.valueOf();
  var dE = dateE.valueOf();



  if((dS < sD) && (dE <= eD))
  {
    result = calcBusinessDays(startD, dateE, fact);
    return result;
  }

  if((dS >= sD) && (dE <= eD))
  {
    result = calcBusinessDays(dateS, dateE, fact);
    return result;
  }

  if((dS >= sD) && (dE > eD))
  {
    result = calcBusinessDays(dateS, endD, fact);
    return result;
  }

  if((dS < sD) && (dE > eD))
  {
    result = calcBusinessDays(startD, endD, fact);
    return result;
  }


/*
  for (let i = 0; i < period; i += 1)
  {
    if ((startD.valueOf() <= addDays(dateS, i).valueOf()) && (addDays(dateS, i).valueOf() < endD.valueOf()))//если рассматриваемая ячейка ресурсов входит в диапазон времени по плану
    {
      if (addDays(dateS, i).getDay() != 0 && addDays(dateS, i).getDay() != 6)// если не выходной
      {
        result += 1;
      }
    }
  }

  return result;
*/
}




Date.prototype.daysInMonth = function() //колличесто дней в месяце
{
	return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
};




function daysInYear(year) //колличесто дней в году
{
  return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
}



function addDays(date, days)// прибавление дней к дате
{
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}



function calcBusinessDays(startDate, endDate, fact)// результатом функции является разница в днях между 2 датами без учета выходных дней
{
  var day = moment(startDate);
  if (gantt.ext.zoom.getCurrentLevel() == 0 && fact == true)
  {
    if (day.day() != 0 && day.day() != 6)// если не выходной
    {
      return 1;
    }
  }
  var businessDays = 0;

  if (gantt.ext.zoom.getCurrentLevel() == 0 && day.day() == 5)
  {
    endDate = addDays(endDate, 2);
  }

  while (day.isSameOrBefore(endDate,'day'))
  {
    if (day.day() != 0 && day.day() != 6) businessDays++;
    day.add(1,'d');
  }
  return businessDays - 1;
}



function endDays(startDate, duration)// подчет конечной даты без учета выходных
{
  var datevar = moment(startDate);
  var i = 0;
  while (i < duration)
  {
    if (datevar.day() != 0 && datevar.day() != 6)// если не выходной
    {
      i += 1;
    }
    datevar = moment(addDays(datevar, 1));
  }
  datevar = new Date(datevar)
  datevar.setHours(0);
  datevar.setMinutes(0);
  datevar.setSeconds(0);
  return datevar;
}

function zeroTime(date)// обнуление часов минут и секунд
{
  date = new Date(date)
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
}
