const menu = [
  { nombre: 'Bruschetta Clásica',     descripcion: 'Pan tostado con tomate y albahaca fresca',    precio: 4500,  categoria: 'Entrada'      },
  { nombre: 'Tabla de Quesos',         descripcion: 'Selección de quesos importados con mermelada', precio: 7800,  categoria: 'Entrada'      },
  { nombre: 'Lomo al Vino Tinto',      descripcion: 'Lomo de res en reducción de vino tinto',       precio: 15500, categoria: 'Plato Fuerte' },
  { nombre: 'Pasta Carbonara',         descripcion: 'Pasta con tocino, huevo y queso parmesano',    precio: 10200, categoria: 'Plato Fuerte' },
  { nombre: 'Salmón a la Plancha',     descripcion: 'Filete de salmón con vegetales al vapor',      precio: 13800, categoria: 'Plato Fuerte' },
  { nombre: 'Tiramisú',               descripcion: 'Postre italiano con café y mascarpone',          precio: 5200,  categoria: 'Postre'       },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá',    precio: 4800,  categoria: 'Postre'       },
];

const reservas = [];


/* reemplaza los plantillos en el menú, si recibe una listra filtrada la muestra, de lo contrario muestra todo el menu*/

function renderMenu(lista = menu) {

  const contenedor = document.getElementById("contenedor-menu");

  contenedor.innerHTML="";

  lista.forEach(plato =>{
    const columna = document.createElement("div");

    columna.classList.add("col-md-4");
  

  const card = document.createElement("div");

  card.classList.add("card-plato");

  card.innerHTML= `
  <h3>${plato.nombre}</h3>
  <p>${plato.descripcion}</p>
  <p><strong>₡${plato.precio.toLocaleString()}</strong></p>
  <span>${plato.categoria}</span>`;

  columna.appendChild(card);
  contenedor.appendChild(columna);
  });
}


/*filtra los platillos por categoria*/

function filtrarCategoria(categoria) {
  if(categoria=="Todos"){
    renderMenu();
    return;
  }

  const resultado = menu.filter(plato=>plato.categoria===categoria);

  renderMenu(resultado);

}

/*valida todos los campos obligatorios*/ 

function validarFormulario() {

  let valido = true;

  const nombre = document.getElementById("nombre").value.trim();

  const correo = document.getElementById("correo").value.trim();
  
  const fecha = document.getElementById("fecha").value;
/*
  const personas = document.getElementById("personas").value;
*/

const personas = Number(
  document.getElementById("personas")?.value || 0
);


  document.getElementById("error-nombre").textContent="";
  document.getElementById("error-correo").textContent="";
  document.getElementById("error-fecha").textContent="";
  document.getElementById("error-personas").textContent="";

  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

  if(nombre.length <5 || !regexNombre.test(nombre)){

    document.getElementById("error-nombre").textContent="ingresee un nombre valido";

    valido = false;

  }

  const regezCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(!regezCorreo.test(correo)){
    document.getElementById("error-correo").textContent="correo invalido";

    valido =false; 
  }

const hoy = new Date();
hoy.setHours(0,0,0,0);

const fechaSeleccionada = new Date(fecha);

if (!fecha || fechaSeleccionada < hoy) {
  document.getElementById("error-fecha").textContent =
    "Seleccione una fecha válida";
  valido = false;
}


  if(personas <1 || personas >20){
    document.getElementById("error-personas").textContent="Debe ser entre 1 y 20";
    valido = false;
  }
  document.getElementById("btn-reservar").disabled=!valido;

  return valido; // Cambiar según la validación
}

/*agregar una reserva a la tabla*/

function agregarReserva() {

  const nombre = document.getElementById("nombre").value;

  const correo = document.getElementById("correo").value;
  
  const fecha = document.getElementById("fecha").value;

  const hora = document.getElementById("hora").value;

  const personas = Number(
  document.getElementById("personas").value
  );

  const reserva ={

    nombre,
    correo,
    fecha,
    hora,
    personas
  };

  reservas.push(reserva);

  const fila = document.createElement("tr");

  fila.classList.add("fila-reserva");

  if(personas >=6){

    fila.classList.add("reserva-vip")
  }

  fila.innerHTML = `
  <td>${nombre}</td>
  <td>${correo}</td>
  <td>${fecha}</td>
  <td>${hora}</td>
  <td>${personas}</td>
  `;

  document.getElementById("tabla-reservas").appendChild(fila);

  actualizarResumen();

  document.getElementById("form-reserva").reset();

  document.getElementById("btn-reservar").disabled = true;


}

/*actualiza resumen estadiscot*/

function actualizarResumen() {

  const totalReservas = reservas.length;

  const totalPersonas = reservas.reduce((total, reserva) => total + reserva.personas, 0);



  let mayorReserva = 0;

  reservas.forEach(reserva=>{
    if(reserva.personas > mayorReserva){

      mayorReserva = reserva.personas;
    }
  });

  document.getElementById("resumen").innerHTML=`
    <h4>Resumen de Reservas</h4>

    <p>
      <strong>Total reservas:</strong>${totalReservas}
    </p>

    <p>
      <strong>Total personas:</strong>${totalPersonas}
    </p>

    <p>
      <strong>Mayor reserva:</strong>${mayorReserva}
    </p>
    `;


}


document.addEventListener("DOMContentLoaded", function () {

  renderMenu();

  document
    .querySelectorAll("#nombre,#correo,#fecha,#hora,#personas")
    .forEach(campo => {

      campo.addEventListener(
        "input",
        validarFormulario
      );

      campo.addEventListener(
        "change",
        validarFormulario
      );
    });

  document
    .getElementById("form-reserva")
    .addEventListener("submit", function (e) {

      e.preventDefault();

      if (validarFormulario()) {
        agregarReserva();
      }
    });

});