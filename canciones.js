tonalidades=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
tonalidades_m=['Cm','C#m','Dm','D#m','Em','Fm','F#m','Gm','G#m','Am','A#m','Bm']
notes_converter=['A','B','C','D','E','F','G','La','Si','Do','Re','Mi','Fa','Sol']
notacion='Latina'
la_letra='x'
tono_audio_global =''

function x(n){
  if (notacion=='Inglesa'){return n}
  if (notacion=='Latina'){
     if (n.length>0){
        return notes_converter[notes_converter.indexOf(n[0])+7]+n.slice(1)
     }
    else{return n}
  }
}

document.getElementById("notacion").addEventListener("change", function() {
  notacion=this.value;
  if (la_letra!=="x"){crear_bloque_letra(la_letra)}
})

function actualizar_notacion(){
  notacion=document.getElementById('temp_acorde').value
}

function reverse_indexes(texto,cadena){
  indexes=[]
  i=texto.indexOf(cadena)
  while (i !== -1) {
    indexes.push(i);
    i = texto.indexOf(cadena, i + cadena.length);
  }
  indexes.sort((a, b) => b - a);
return indexes
}

function pinta_linea_1(linea, bloque){
    if (linea.includes('ESTRIBILLO')){estilo='estrib'}
    if (linea==""){estilo='estrofa'}

    function separar_letras_acordes(text){
        acordes=[];letras=[];next='letra_nueva'
        if (text[0]!='['){letras.push('');acordes.push('')}
        for (let i=0;i<text.length;i++){
            if (text[i]=='['){next='acorde_nuevo';acordes.push('')}
            else if (text[i]==']'){next='letra_nueva';letras.push('')}
            else if (next=='acorde_nuevo'){acordes[acordes.length-1]+=text[i]}
            else if (next=='letra_nueva'){letras[letras.length-1]+=text[i]}
        }
        if (letras.length<acordes.length){letras.push('')}
        for (let i=0;i<acordes.length;i++){if (acordes[i].length>0){acordes[i]+=' '}}
        return {acordes:acordes,letras:letras}
    }

    function alinear(linea_obj, contenedor, est){
        acordes=linea_obj.acordes;letras=linea_obj.letras
        acordes=acordes.map(n => x(n))      
        contenedor.innerHTML+="<div id='temp_acorde' class='acorde_"+est+"' style='display:inline-block;visibility:hidden'> </div><div id='temp_letra' class='letra_"+est+"' style='display:inline-block;visibility:hidden'> </div>"
        ta=document.getElementById('temp_acorde');tl=document.getElementById('temp_letra')
        ancho_espacio_acorde=ta.getBoundingClientRect().width
        ancho_espacio_letra=tl.getBoundingClientRect().width
        tl.innerHTML="-";ancho_guion_letra=tl.getBoundingClientRect().width
        for (let i=0;i<Math.min(acordes.length,letras.length);i++){
            if ((i==0)&(acordes[0]=='')){continue}
            ta.innerHTML=acordes.slice(0,i).join('');x1_ta=ta.getBoundingClientRect().width
            ta.innerHTML=acordes.slice(0,i).concat(acordes[i].replace(' ','')).join('');x2_ta=ta.getBoundingClientRect().width
            xa=Math.round((x1_ta+x2_ta)/2)
            tl.innerHTML=letras.slice(0,i).join('');x1_tl=tl.getBoundingClientRect().width
            tl.innerHTML=letras.slice(0,i).concat([letras[i][0]]).join('');x2_tl=tl.getBoundingClientRect().width
            xl=Math.round((x1_tl+x2_tl)/2)
            if (xa>xl){
                num_esp=Math.trunc((xa-xl+ancho_espacio_letra/2)/ancho_espacio_letra)
                num_gui=Math.trunc((xa-xl+ancho_guion_letra/2)/ancho_guion_letra)
                insertar=" ".repeat(num_esp)
                if (i==0){if (letras[i][0]==' '){letras[i]=insertar+letras[i]}}
                else if ((letras[i].length>0)&(letras[i-1].length>0)){
                    if (letras[i][0]==' '){letras[i]=insertar+letras[i]}
                    else if (letras[i-1].includes(' ')){
                        last_sp=letras[i-1].lastIndexOf(' ')
                        letras[i-1]=letras[i-1].substring(0,last_sp+1)+insertar+letras[i-1].substring(last_sp+1)
                    }
                    else{letras[i]="-".repeat(num_gui)+letras[i]}
                }
            }
            else{
                num_esp=Math.trunc((xl-xa+ancho_espacio_acorde/2)/ancho_espacio_acorde)
                acordes[i]=" ".repeat(num_esp)+acordes[i]
            }
        }
        document.getElementById('temp_acorde').remove();document.getElementById('temp_letra').remove()
        contenedor.innerHTML+="<div class='acorde_"+est+"'>"+acordes.join('')+"</div>"
        contenedor.innerHTML+="<div class='letra_"+est+"'>"+letras.join('')+"</div>"
    }

    if (linea.includes('ESTRIBILLO')){
        bloque.innerHTML+="<div class='letra_estrib'>      ESTRIBILLO</div>"
    }
    else if (linea.replace(' ','')==''){
        bloque.innerHTML+='<br>'
    }
    else{
        alinear(separar_letras_acordes(linea), bloque, estilo)
    }
}

function crear_bloque_letra(letra){////////////////////////////------Esta función dibuja el bloque de la letra y los acordes de una canción
  document.getElementById("bloque_letra").innerHTML = '<h2 id="titulo">'+letra.titulo+'</h2>'
  document.getElementById("bloque_letra").innerHTML += '<h3 style="display:inline-block; margin-right:10px;" id="tonalidad" data-value="'+letra.tonalidad+'">tonalidad: '+x(letra.tonalidad)+'</h3>'
  document.getElementById("bloque_letra").innerHTML += '<label style="display:inline-block;">Transponer a:</label>'
  document.getElementById("bloque_letra").innerHTML += '<select id="transponer" onchange=transponer(this.value)></select>'
  
  if (letra.tonalidad.charAt(letra.tonalidad.length - 1)=='m'){
    tonalidades_m.forEach((t,i)=>{
      if (letra.tonalidad===t){s=" selected"}
      else{s=""}
      document.getElementById("transponer").innerHTML += '<option value="'+t+'"'+s+'>'+x(t)+'</option>'
      })
  }
  else{
    tonalidades.forEach((t,i)=>{
      if (letra.tonalidad===t){s=" selected"}
      else{s=""}
      document.getElementById("transponer").innerHTML += '<option value="'+t+'"'+s+'>'+x(t)+'</option>'
      })
  }

  lineas = letra.letra.trim().split("\n");
  estilo='estrofa'

  lineas.forEach((linea, i) => {
    pinta_linea_1(lineas[i], document.getElementById("bloque_letra"))
  });

  if (document.getElementById("audio_text")){
    audio_desc=document.getElementById("audio_text").innerHTML
    if (audio_desc.startsWith('Versión de audio por ')){
      document.getElementById("audio_text").innerHTML='Versión de audio por '+x(tono_audio_global)
    }
  }
}

function transponer(nuevo){////////////////////////////------Esta función realiza la trasposcón de acordes de una canción mostrada
      final=nuevo
      actual=document.getElementById("tonalidad").dataset.value
      actual=actual.replace("tonalidad: ","")
      document.getElementById("tonalidad").innerHTML="tonalidad: "+nuevo
    
      if (actual.charAt(actual.length - 1)==='m'){
        actual=actual.substring(0,actual.length - 1)
        nuevo=nuevo.substring(0,nuevo.length - 1)
      }
      cambio=(12+tonalidades.indexOf(nuevo)-tonalidades.indexOf(actual))%12
    
      indexes=reverse_indexes(letra.letra,"[")
      indexes.forEach((index,i)=>{
        text_to_replace=letra.letra.substring(index+1,index+3)
        if (text_to_replace[1]!='#'){text_to_replace=text_to_replace[0]}
        replacing_text=tonalidades[(12+tonalidades.indexOf(text_to_replace)+cambio)%12]
        letra.letra=letra.letra.substring(0,index)+letra.letra.substring(index).replace(text_to_replace,replacing_text)
      })
      letra.tonalidad=final
      document.getElementById("bloque_letra").innerHTML=" "
      la_letra=letra
      crear_bloque_letra(letra)
}

async function fileExist(ruta) {
    try {
        const resp = await fetch(ruta, { method: "HEAD" });
        return resp.ok;   // true si existe (200), false si no (404)
    } catch (e) {
        return false;     // error de red → tratar como que no existe
    }
}

async function mostrarAudioLetraAcordes(audio_file, tono_audio, txt_file) {
  tono_audio_global=tono_audio
  fileExist(audio_file).then(exist => {
    if (exist) {
      document.getElementById("bloque_audio").innerHTML = '<br>'
      document.getElementById("bloque_audio").innerHTML += '<audio controls src="'+audio_file+'"></audio>'
      document.getElementById("bloque_audio").innerHTML += '<p id="audio_text" style="color: grey;">Versión de audio por '+x(tono_audio)+'</p>'
    } else {
      document.getElementById("bloque_audio").innerHTML = '<br>'
      document.getElementById("bloque_audio").innerHTML += '<audio controls src="'+audio_file+'"></audio>'
      document.getElementById("bloque_audio").innerHTML += '<p  id="audio_text" style="color: grey;">Aun no hemos incluido un audio para esta canción</p>'
    }
});
  letra_acordes = await (await fetch((txt_file))).text();
  eval(letra_acordes)
  la_letra=letra
  crear_bloque_letra(letra)
}        

function buscarCanciones(canciones) {
    function sinAcentos(t) {
      return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }  
  la_letra="x"
  document.getElementById('bloque_audio').innerHTML=""
  document.getElementById('bloque_letra').innerHTML=""
  tiempo=document.getElementById('tiempo').value
  misa=document.getElementById('misa').value
  momento=document.getElementById('momento').value
  texto=document.getElementById('textoBusqueda').value.toLowerCase()

  document.getElementById("resultados").innerHTML = ""

  canciones_filtradas = canciones.filter(c =>
      ( tiempo==="" || (c.tiempos.includes(tiempo))) &&
      ( misa==="" || (c.misas.includes(misa))) &&
      ( momento==="" || (c.momentos.includes(momento))) &&
      ( texto==="" || sinAcentos(c.titulo).toLowerCase().includes(sinAcentos(texto)))
      )

  canciones_filtradas.sort((a,b)=>a.titulo.localeCompare(b.titulo))

  canciones_filtradas.forEach(c => {
    audio_icon = ""
    txt_icon = ""
    if (c.audio.includes(".")){audio_icon = " ♫"}
    if (c.txt.includes(".")){txt_icon = " 📄"}
    showing_title = c.titulo + txt_icon + audio_icon
    tono_audio_global = c.tono_audio

    document.getElementById('resultados').innerHTML += `
      <div class="cancion">
        <h3 class="result" onclick="mostrarAudioLetraAcordes('${c.audio}', '${c.tono_audio}', '${c.txt}')">${showing_title} </h3>
      </div>`;
  });  
}


async function listarCanciones(txt_file) {///////---- función asíncrona que lee la lista de todas las canciones
    canciones = await (await fetch((txt_file))).text();
    canciones = eval(canciones)
    document.getElementById("tiempo").addEventListener("change", () => buscarCanciones(canciones));
    document.getElementById("misa").addEventListener("change", () => buscarCanciones(canciones));
    document.getElementById("momento").addEventListener("change", () => buscarCanciones(canciones));
    document.getElementById("textoBusqueda").addEventListener("change", () => buscarCanciones(canciones));
    document.getElementById("btnBuscar").addEventListener("click", () => buscarCanciones(canciones));
}
 
listarCanciones("canciones.txt")

