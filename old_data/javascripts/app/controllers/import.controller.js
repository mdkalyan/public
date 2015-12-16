/*function ImportCtrl($scope,$dialog, $state,$stateParams,$location, $routeParams,$log,$q){
	$scope.file = {};
	$scope.import = function(file){
		var _submit = document.getElementById('_submit');
		var _file = document.getElementById('_file');
		if (_file.files.length === 0) {
			return;
		}
		var data = new FormData();
		data.append('SelectedFile',_file.files[0]);
		var request = new XMLHttpRequest();
		request.onreadystatechange = function(){
			try{
				var resp = JSON.parse(request.response);
			}catch(e){

			}
		}
		MedStac.Utils.StatusNotification.show(1,"Uploading...");
		request.open('POST', MedStac.Constants.END_POINT_FILE_IMPORT);
		request.send(data);	
	}
}
ImportCtrl.$inject = ['$scope','$dialog', '$state','$stateParams', '$routeParams','$location','$log','$q'];*/
