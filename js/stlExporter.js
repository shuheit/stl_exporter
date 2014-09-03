(function() {
  var loader = new THREE.STLLoader();
  loader.addEventListener( 'load', function ( event ) {
    var geometry = event.content;
    saveSTL(geometry);
  } );
  // Specify STL file
  loader.load( '' );

  function saveSTL( geometry ){
    // Choose file type
    //var stlString = generateSTLAsAschii( geometry );
    //var stlString = generateSTLAsBinary( geometry );
    var blob = new Blob( [stlString], {type: 'text/plain'} );
    saveAs(blob, 'exported.stl');
  }

  function generateSTLAsAschii( geometry ){
    var faces = geometry.faces;
    var vertices = geometry.vertices;

    var stl = "solid Exported STL Model as ASCHII \n";
    for(var i = 0; i<faces.length; i++){
      stl += ("facet normal "+stringifyVector( faces[i].normal )+" \n");
      stl += ("outer loop \n");
      stl += stringifyVertex( vertices[ faces[i].a ]);
      stl += stringifyVertex( vertices[ faces[i].b ]);
      stl += stringifyVertex( vertices[ faces[i].c ]);
      stl += ("endloop \n");
      stl += ("endfacet \n");
    }
    stl += ("endsolid");
    return stl;
  }

  function stringifyVector(vec){
    return ""+vec.x+" "+vec.y+" "+vec.z;
  }

  function stringifyVertex(vec){
    return "vertex "+stringifyVector(vec)+" \n";
  }

  function generateSTLAsBinary( geometry ){
    var faces = geometry.attributes.normal.array;
    var vertex = create2DArray(geometry.attributes.position.array);
    var triangles = vertex.length/3;

    var pos = 80;
    var bytes = 80+4+50*triangles;
    
    console.log(geometry);
    console.log(vertex);
    console.log(triangles);
    console.log(bytes);
    
    var arrayBuffer = new ArrayBuffer(bytes);
    var data = new DataView(arrayBuffer);
    var littleEndianStr = "little_endian";

    // First 80 bytes
    //var first80Bytes = new Float32Array("Exported STL model as Binary                                                    ");
    //data.setFloat32(0, first80Bytes, littleEndianStr);

    // Number of triangles
    data.setInt32(pos, triangles, littleEndianStr);
    pos += 4;

    for(var i = 0; i<vertex.length; i+=3){
      var face = faces[i];

      // Normal vector
      data.setFloat32(pos, 0, littleEndianStr);
      pos += 4;
      data.setFloat32(pos, 0, littleEndianStr);
      pos += 4;
      data.setFloat32(pos, 0, littleEndianStr);
      pos += 4;
      
      // 3 vertices
      for (var j = 0; j<3; j++) {
        data.setFloat32(pos, vertex[i+j][0], littleEndianStr);
        pos += 4;
        data.setFloat32(pos, vertex[i+j][1], littleEndianStr);
        pos += 4;
        data.setFloat32(pos, vertex[i+j][2], littleEndianStr);
        pos += 4;
      }

      // Unused data
      data.setInt16(pos, 0, littleEndianStr);
      pos += 2;
    }

    console.log(pos);
    return data;
  }

  function create2DArray( array ){
    var newArray = new Array(array.length/3);
    for(var i=0; i<newArray.length; i++){
      newArray[i] = new Array(3);
    }
    var i = 0;
    for(var row=0; row<array.length/3; row++){
      for(var col=0; col<3; col++){
        newArray[row][col] = array[i];
        i++;
      }
    }
    return newArray;
  }
})();