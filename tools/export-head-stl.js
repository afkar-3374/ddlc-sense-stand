// Exports the pan/tilt head from head.html as binary STL (mm, Z up), level pose, no mast stub.
// Usage: node tools/export-head-stl.js head.html out.stl
const fs=require('fs');
const THREE=require('three');
const html=fs.readFileSync(process.argv[2],'utf8');
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b));
const code=cut('/* ---------- Materials','/* ---------- End head geometry')+'return {root,stub};';
const scene=new THREE.Scene();
const {root,stub}=new Function('THREE','scene',code)(THREE,scene);
root.remove(stub);root.scale.setScalar(1);root.updateMatrixWorld(true);
const tris=[];const v=new THREE.Vector3();
root.traverse(o=>{
  if(!o.isMesh)return;
  const g=(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone()).applyMatrix4(o.matrixWorld);
  const p=g.attributes.position;
  for(let i=0;i<p.count;i+=3){const t=[];for(let k=0;k<3;k++){v.fromBufferAttribute(p,i+k);t.push(v.x,-v.z,v.y);}tris.push(t);}
});
const buf=Buffer.alloc(84+tris.length*50);
buf.write('DDLC Sense Stand head (mm, Z up)',0);buf.writeUInt32LE(tris.length,80);
let o=84;const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),n=new THREE.Vector3();
for(const t of tris){a.set(t[0],t[1],t[2]);b.set(t[3],t[4],t[5]);c.set(t[6],t[7],t[8]);
  n.subVectors(c,b).cross(new THREE.Vector3().subVectors(a,b)).normalize();
  for(const x of[n.x,n.y,n.z,...t]){buf.writeFloatLE(x||0,o);o+=4;}o+=2;}
fs.writeFileSync(process.argv[3],buf);
console.log(process.argv[3],tris.length,'triangles');
