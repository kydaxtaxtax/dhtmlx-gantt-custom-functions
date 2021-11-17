
function getResource(id)
{
  var task = gantt.getTask(id);// достаем задачу
  if(task.resourceOn == undefined)
  {
    if (task.type == "splitTask")
    {
      var res = task.parent;
    }
    else
    {
      var res = id;
    }

    localStorage.setItem("id", res);
    gantt.load("data/" + res);
    return true;
  }
}


  function redefineEditor(task)
  {
    console.log(task.type);
    gantt.resetLightbox();//переопределить наполнение Лайтбокса

    if (task.type == "splitTask")
    {
        gantt.config.lightbox_additional_height = 900;
      gantt.config.lightbox.sections = split_lightbox;

      return true;
    }

      gantt.config.lightbox.project_sections = createProjects;
      return true;

  }



    function showLightbox(id)
    {
      gantt.showLightbox(id);
      return true;
    }

  // lightbox_additional_height
  gantt.attachEvent("onLightboxDelete", function(id){
    var task = gantt.getTask(id);
    gantt.selectTask(task.parent);
    return true;
  })

    gantt.attachEvent("onLightboxSave", function(id, task, is_new){
        gantt.selectTask(task.parent);
        return true;

    })

    gantt.attachEvent("onLightboxCancel", function(id){

          gantt.selectTask(task.parent);
          return true;
    })





  gantt.attachEvent("onTaskDblClick", function(id)// Открываем форму редактирования при двойном на жатии (только у задачи)
    {
        var task = gantt.getTask(id);
        if(task.type != "splitTask")
        {
          redefineEditor(task);
          gantt.showLightbox(id);
        }
  });

  gantt.attachEvent("onTaskSelected", function (id)
    {
      var task = gantt.getTask(id);

      if (task.type == "splitTask")
      {
        redefineEditor(task);
        getResource(id);
        setTimeout(showLightbox, 1000, id);

        return true;
      }
      else
      {
        getResource(id);
        return true;
      }
      setTimeout(getResource, 250, id);

/*
      var task = gantt.getTask(id);// достаем задачу
      console.log(task.type);
      if (task.type != "splitTask")
      {
        getResource(id);
      }
      return true;



    setTimeout(gantt.showLightbox(), 1000, id);
    return true;
*/
  });
/*
  gantt.attachEvent("onBeforeLightbox", function(id)
    {
      var task = gantt.getTask(id);

      if (task.type == "splitTask")
      {
        getResource(id);
        return true;
      }


  });

*/

  gantt.attachEvent("onParse", function ()
  {

  });
/*
  gantt.attachEvent("onLoadEnd", function ()//после загрузки ганта возвращаемся на выбранную задачу
  {
      // document.getElementsByClassName("gantt_layout_x")[0].scrollTop = positionVer;
      function fu(){

        let id = localStorage.getItem("id");
        var task = gantt.getTask(id);
        var sizes = gantt.getTaskPosition(task, task.start_date, task.end_date);
        gantt.scrollTo(sizes.left, sizes.top);
        gantt.selectTask(id);
      }
      // setTimeout(fu,1000);
      fu();

  });
*/
  //gantt.init("gantt_here");
/*
  gantt.attachEvent("onTaskSelected", function(id)//после выбора задачи смотрим ее с начала шкалы
  {

      function fu(){
        let id = localStorage.getItem("id");
        var task = gantt.getTask(id);
        var sizes = gantt.getTaskPosition(task, task.start_date, task.end_date);
        gantt.scrollTo(sizes.left, sizes.top);
        gantt.selectTask(id);
      }
      setTimeout(fu(),1000);

  });
*/
