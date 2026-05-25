let tarjetas=[];
let editandoID=null;

function loadTarjetas(){
    const guardada= localStorage.getItem('tarjetasApp');
    if(guardada){
        tarjetas=JSON.parse(guardada);
    }else{
        tarjetas=[];
    }
    return tarjetas;
}
function saveTarjetas() {
    localStorage.setItem('tarjetasApp',JSON.stringify(tarjetas));
}
function mostrarTarjetas() {
    const contenedor=document.getElementById('Tarjetas');
    const mensaje= document.getElementById('mensaje');
    if (!contenedor) {
        return;
    }
    loadTarjetas();
    if (tarjetas.length===0) {
        contenedor.innerHTML="";
        if(mensaje){
           mensaje.style.display= 'block'; 
        }
        return; 
    }
    if(mensaje){
        mensaje.style.display= 'none';
    }
    contenedor.innerHTML="";
    tarjetas.forEach(tarjeta=>{
        const tarjetaDiv= document.createElement('div');
        tarjetaDiv.className="tarjeta";
        tarjetaDiv.style.borderLeftColor= tarjeta.color;
        tarjetaDiv.setAttribute("data-id", tarjeta.id);
        const fecha=new Date(tarjeta.fecha);
        const fechaStr= `${fecha.getDate()}///${fecha.getMonth()+1}///${fecha.getFullYear()}`;
        tarjetaDiv.innerHTML=`
        <h3>${escapeHTML(tarjeta.nombre)}</h3>
        <p>Profesión: ${escapeHTML(tarjeta.profesion)}</p>
        <p>Descripción: ${escapeHTML(tarjeta.descripcion)}</p>
        <div class="fecha">Creada: ${fechaStr}</div>
        <div class="botonesTarjeta">
            <button class="editar" onclick="editarTarjeta(${tarjeta.id})">Editar</button>
            <button class="eliminar" onclick="eliminarTarjeta(${tarjeta.id})">Eliminar</button>
        </div>
        `;
        contenedor.appendChild(tarjetaDiv);
    });
}
function eliminarTarjeta(id) {
    if(confirm('¿Seguro que quieres eliminar esta tarjeta?')){
        tarjetas=tarjetas.filter(t => t.id !== id);
        saveTarjetas();
        mostrarTarjetas();
    }
}
function editarTarjeta(id) {
    localStorage.setItem('editandoID',id);
    window.location.href='generador.html';
}
function cargarDatosTarjeta() {
    const edit=localStorage.getItem('editandoID');
    if (edit) {
        editandoID=parseInt(edit);
        loadTarjetas();
        const tarjeta= tarjetas.find(t => t.id === editandoID);
        if (tarjeta) {
            document.getElementById('name').value=tarjeta.nombre;
            document.getElementById('pro').value=tarjeta.profesion;
            document.getElementById('des').value=tarjeta.descripcion;
            document.getElementById('color').value=tarjeta.color;
            document.getElementById('boton').value="Editar Tarjeta";
            document.getElementById('btn').style.display='block';
        }
    }else{
        document.getElementById('boton').value="Generar Tarjeta";
        document.getElementById('btn').style.display='none';
        editandoID=null;
    } 
}
function saveTarjetaEdit(evento) {
    evento.preventDefault();
    const nombre= document.getElementById('name').value.trim();
    const profesion= document.getElementById('pro').value.trim();
    const descripcion= document.getElementById('des').value.trim();
    const color= document.getElementById('color').value.trim();
    if(!nombre || !profesion || !descripcion || !color){
        window.alert("Por favor rellene todos los campos");
        return;
    }
    loadTarjetas();
    if(editandoID){
        const index=tarjetas.findIndex(t => t.id === editandoID);
        if (index!==-1) {
            tarjetas[index]={
                ...tarjetas[index],
                nombre: nombre,
                profesion: profesion,
                descripcion: descripcion,
                color: color,
                fechaEditada: new Date().toISOString()
            };
            saveTarjetas();
            window.alert("Tarjeta editada");
        }
        editandoID=null;
        localStorage.removeItem('editandoID');
    }else{
        const nuevaTarjeta = {
            id: Date.now(),
            nombre: nombre,
            profesion: profesion,
            descripcion: descripcion,
            color: color,
            fecha: new Date().toISOString()
        };
        tarjetas.push(nuevaTarjeta);
        saveTarjetas();
        window.alert("Tarjeta creada");
    }
    if(confirm("¿Quieres ver todas las tarjetas?")){
        window.location.href='tarjetero.html';
    }else{
        document.getElementById('formT').reset();
        cargarDatosTarjeta();
    }  
}
function cancelarEdit() {
    if (confirm('¿Cancelar edicion?')) {
        editandoID=null;
        localStorage.removeItem('editandoID');
        document.getElementById('formT').reset();
        cargarDatosTarjeta();
    }
}
function escapeHTML(str) {
    if(!str) return'';
    return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}

if (document.getElementById('Tarjetas')) {
    mostrarTarjetas();
}
if (document.getElementById('formT')) {
        cargarDatosTarjeta();
        const formulario=document.getElementById('formT');
        if (formulario) {
            formulario.addEventListener('submit',saveTarjetaEdit);
        }
        const btnCancelar= document.getElementById('btn');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', cancelarEdit);
        }
}
