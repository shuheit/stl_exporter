function generateSTLAsBinary( geometry ){
  var faces = geometry.attributes.normal.array;
  var vertex = create2DArray(geometry.attributes.position.array);
  var triangles = vertex.length/3;

  var pos = 80;
  var bytes = 80+4+50*triangles;
        
  var arrayBuffer = new ArrayBuffer(bytes);
  var data = new DataView(arrayBuffer);
  var littleEndianStr = "little_endian";

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