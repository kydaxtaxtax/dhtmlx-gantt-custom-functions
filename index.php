<?php
if(!isset($_REQUEST['code_object']) && isset($_REQUEST['idOn']))
	header("Location: /server/gantt_resourse.php?t=".$_REQUEST['idOn']);
?>
<!DOCTYPE html>
<html lang="ru">
	<head>
		<meta charset="utf-8">

		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<script src="/plagins/dhtmlx_gantt/codebase/dhtmlxgantt.js?v=6.3.5"></script>  <!-- js для Ганта -->
		<link rel="stylesheet" href="/plagins/dhtmlx_gantt/codebase/dhtmlxgantt.css?v=6.3.4">  <!-- css для Ганта -->
		<link rel="stylesheet" href="/plagins/dhtmlx_gantt/common/controls_styles.css?v=6.3.4">  <!-- css для Ганта -->
		<script src="http://export.dhtmlx.com/gantt/api.js"></script>  <!-- js экспорт (для выгрузки из Ганта) -->
		<script src="/plagins/dhtmlx_gantt/common/testdata.js?v=6.3.4"></script>  <!-- js-->
		<script src="/plagins/dhtmlx_gantt/codebase/locale/locale_ru.js" charset="utf-8"></script>  <!-- подключение Русского языка -->
		<link href="/css/style.css" rel="stylesheet" type="text/css">  <!-- подключение главного css -->
		<link href="/css/stylefonts.css" rel="stylesheet" type="text/css">  <!-- подключение шрифтов -->
		<link rel="stylesheet" href="/plagins/dhtmlx_gantt/common/snippets/dhx_file_dnd.css?v=6.3.4">  <!-- css для Ганта -->
		<link rel="stylesheet" href="/plagins/bootstrap/css/bootstrap.min.css">  <!-- css для bootstrap -->
		<link rel="stylesheet" href="/fonts/font-awesome-4.7.0/css/font-awesome.min.css">  <!-- доп классы для css -->
		<script src="/plagins/dhtmlx_gantt/codebase/ext/dhtmlxgantt_auto_scheduling.js"></script>  <!-- для автоматического планирования -->
		<script src="/plagins/dhtmlx_gantt/codebase/ext/dhtmlxgantt_tooltip.js?v=6.3.4"></script>  <!-- всплывающие подсказки -->
		<script src="/plagins/jquery/jquery-3.0.0.min.js"></script>  <!-- jQuery -->
		<script src="/js/fileinput.js"></script>  <!-- js Импорт(для загрузки в Ганта) -->
		<script src="/plagins/dhtmlx_gantt/common/snippets/dhx_file_dnd.js?v=6.3.4"></script> <!-- js для Ганта -->
		<script src="/plagins/bootstrap/js/bootstrap.min.js"></script>  <!-- Bootstrap JS -->
		<script src="/plagins/dhtmlx_gantt/codebase/ext/dhtmlxgantt_fullscreen.js?v=6.3.4"></script> <!-- для полноэкранного режима -->
		<script src="/plagins/dhtmlx_gantt/codebase/ext/dhtmlxgantt_keyboard_navigation.js"></script> <!-- навигация с помощью клавиатуры для редактирования -->
		<script src="/plagins/dhtmlx_gantt/codebase/ext/dhtmlxgantt_grouping.js?v=6.3.4"></script>  <!-- для ресурсного планирования -->
	  <script src="/plagins/dhtmlx_gantt/common/resource_filter.js?v=6.3.4"></script>  <!-- для ресурсного планирования -->

	</head>
	<body>
		<div id="myCover"> <!-- На весь экран -->
			<div class="gantt_control"></div>
			<div id="gantt_here"></div>
		</div>
		<!-- выгрузка из базы по коду объекта -->
		<div class="grid">

			<div class="grid_row_m">

				<div class="grid_item">
					<form action="index.php" method="GET" enctype="multipart/form-data">
						<input type="text" name="code_object" placeholder="Введите код объекта" class="text-button-diagram-gant" size="20">
				</div>

						<div class="grid_item">
							<input type="submit" value="Загрузить" class="setting-button-diagram-gant">
						</div>

					</form>

			</div>

			<div class = "grid_row_m">

				<div class = "grid_item">
					<form id = "mspImport" action = "" method = "POST" enctype = "multipart/form-data">
						<input type = "file" id="mspFile" name = "file"
							accept = ".mpp,.xml, text/xml, application/xml, application/vnd.ms-project, application/msproj, application/msproject, application/x-msproject, application/x-ms-project, application/x-dos_ms_project, application/mpp, zz-application/zz-winassoc-mpp"/>
						<div class = "fileUpload" data-name = "file" style="display: none;">
							<div class = "fileBtn"></div>
							<div class = "filename"></div>
						</div>
				</div>

					<div class = "grid_item">
						<button id="mspImportBtn" type="submit" class="setting-button-diagram-gant">Загрузить</button>
					</div>

					</form>
				</div>

 			<!-- Экспорт -->
			<div class = "grid_row_m">

				<div class = "grid_item">
					<input value = "Выгрузка в MS Project" type = "button" onclick = 'gantt.exportToMSProject({skip_circular_links: true})' class = "setting-button-diagram-gant">
				</div>

				<div class = "grid_item">
					<input value="Выгрузка в Excel" type = "button" onclick = 'gantt.exportToExcel()' class = "setting-button-diagram-gant">
				</div>

				<div class = "grid_item">
					<input value = "Выгрузка в PDF" type = "button" onclick = 'export_PDF()' class = "setting-button-diagram-gant">
				</div>

			</div>

			<!--  zoom  -->
			<div class = "grid_row_m">

				<div class = "grid_item">
					<button id = "toggle_fullscreen" onclick = "gantt.ext.fullscreen.toggle();" class = "setting-button-diagram-gant">Во весь экран</button>
				</div>

				<div class = "grid_item">
				 	<input type = "button" value = "+" onclick = "zoomIn()" class = "setting-button-diagram-gant">
				</div>

				<div class="grid_item">
				 	<input type="button" value="-" onclick="zoomOut()" class = "setting-button-diagram-gant">
				</div>

			</div>

	 </div>

		<!--<script src="/js/import.js"></script>-->
		<script src="/js/zoom.js"></script>
		<script src="/js/baselines.js"></script> <!-- Настройки визуализации Ганта -->
		<script src="/js/resourseManagment.js"></script> <!-- Настройки визуализации Ганта -->
		<script src="/js/configLayout.js"></script> <!-- Настройки визуализации Ганта -->
		<script src="/js/export.js"></script>  <!-- настройка экспорта -->

		<script>
			gantt.init("gantt_here");

		</script>

			<script src="/js/logBaner.js"></script> <!-- банеры с логами  -->

		<script>

				gantt.load("/gantt/<?php echo $_GET['code_object'];echo (isset($_GET['idOn']))?'/data/'.$_GET['idOn']:'/data';?>");
		    var dp = gantt.createDataProcessor
				({
		      url: "/gantt/<?php echo $_GET['code_object'];?>/data",
		      mode: "REST"
		    });

		</script>


	</body>
	</html>
