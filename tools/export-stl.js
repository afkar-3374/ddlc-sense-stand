const fs=require('fs');
const THREE=require("three");
const html=fs.readFileSync(process.argv[3],'utf8');
const cut=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b));
const code=cut('/* ---------- Design parameters','/* ---------- Renderer')
 +cut('/* ---------- Materials','/* ---------- Pose')
 +`return {root,stages,head,pan,tilt,P,plateTop};`;
const fakeCanvas={width:0,height:0,getContext:()=>new Proxy({},{get:()=>()=>{}})};
const document={createElement:()=>fakeCanvas};
const ground={};const scene=new THREE.Scene();
const S=new Function('THREE','document','ground','scene',code)(THREE,document,ground,scene);
const {root,stages,head,P,plateTop}=S;
const heightMm=+process.argv[5];
const e=(heightMm-plateTop-P.L-P.headH)/3;
stages.forEach((g,i)=>g.position.y=plateTop+i*e);
head.position.y=plateTop+3*e+P.L;
root.scale.setScalar(1);
root.updateMatrixWorld(true);
const tris=[];const v=new THREE.Vector3();
root.traverse(o=>{
  if(!o.isMesh||o.userData.proxy||o.geometry.type==='PlaneGeometry')return;
  let g=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();
  g.applyMatrix4(o.matrixWorld);
  const p=g.attributes.position;
  for(let i=0;i<p.count;i+=3){const t=[];for(let k=0;k<3;k++){v.fromBufferAttribute(p,i+k);t.push(v.x,-v.z,v.y);}tris.push(t);} // Z-up for CAD
});
const buf=Buffer.alloc(84+tris.length*50);
buf.write('DDLC Sense Stand (mm, Z up)',0);buf.writeUInt32LE(tris.length,80);
let o=84;const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),n=new THREE.Vector3();
for(const t of tris){a.set(t[0],t[1],t[2]);b.set(t[3],t[4],t[5]);c.set(t[6],t[7],t[8]);
  n.subVectors(c,b).cross(b.clone().sub(a).negate()).normalize();
  for(const x of[n.x,n.y,n.z,...t]){buf.writeFloatLE(x||0,o);o+=4;}o+=2;}
fs.writeFileSync(process.argv[4],buf);
console.log(process.argv[4],tris.length,'triangles');
