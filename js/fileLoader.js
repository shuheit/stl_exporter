var button = document.getElementById("button");
button.addEventListener("change", function(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload=function(event) {
    var data = event.target.result;
    var blob = new Blob([data], {'type' : file.type}); 
    var url = window.URL.createObjectURL(blob);      
    var loader = new THREE.STLLoader();
    loader.addEventListener('load', function(event) {
      var geometry = event.content;
      saveSTL(geometry);
    });
    loader.load(url);
  };
  reader.readAsArrayBuffer(file);
}, false);

function saveSTL( geometry ) {
  var stlString;
  if(geometry.faces) {
    console.log("aschii");
    stlString = generateSTLAsAschii( geometry );
  } else if(geometry.attributes.normal) {
    console.log("binary");
    stlString = generateSTLAsBinary( geometry );
  } else {
    console.log("not supported");
    return;
  }  
  var blob = new Blob( [stlString], {type: 'text/plain'} );
  saveAs(blob, 'exported.stl');
}