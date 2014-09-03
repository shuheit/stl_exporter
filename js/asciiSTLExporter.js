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