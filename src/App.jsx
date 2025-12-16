import { useState, useEffect } from "react"
import { productos } from "./data/productos"

const colores = {
  azul: "rgb(12, 70, 117)",
  texto: "#1F2933",
  fondo: "#FFFFFF",
  tarjeta: "#FFFFFF",
  borde: "#E5E7EB",
  efectivo: "#16A34A",
  transferencia: "rgb(12, 70, 117)",
  blanco: "#FFFFFF"
}

function App() {
  const hoy = new Date().toLocaleDateString()

  // ---------- ESTADOS ----------
  const [salidas, setSalidas] = useState(() => {
    const data = localStorage.getItem("salidas")
    const fecha = localStorage.getItem("fecha")

    if (data && fecha === hoy) {
      return JSON.parse(data)
    }

    localStorage.setItem("fecha", hoy)
    return []
  })

  const [productoPrecioVisible, setProductoPrecioVisible] = useState(null)
  const [mostrarReporte, setMostrarReporte] = useState(false)

  // ---------- EFECTO ----------
  useEffect(() => {
    localStorage.setItem("salidas", JSON.stringify(salidas))
    localStorage.setItem("fecha", hoy)
  }, [salidas, hoy])

  // ---------- FUNCIONES ----------
  const registrarSalida = (producto, formaPago) => {
    const nombre = prompt("Nombre del cliente:") || ""
    const telefono = prompt("Teléfono del cliente:") || ""
    const observacion = prompt("Observación:") || ""

    setSalidas(prev => [
      ...prev,
      {
        item: producto.item,
        nombreProducto: producto.nombre,
        precio: producto.precio,
        formaPago,
        cliente: { nombre, telefono, observacion },
        fecha: hoy
      }
    ])
  }

  const generarReporte = () => {
    if (salidas.length === 0) return "No hay salidas registradas hoy."

    let texto = `📦 SALIDAS DEL DÍA – ${hoy}\n\n`

    const efectivo = salidas.filter(s => s.formaPago === "efectivo")
    const transferencia = salidas.filter(s => s.formaPago === "transferencia")

    if (efectivo.length) {
      texto += "💵 EFECTIVO:\n"
      efectivo.forEach(s => {
        texto += `${s.item} – ${s.nombreProducto} – $${s.precio.toLocaleString()}\n`
        if (s.cliente.nombre || s.cliente.telefono) {
          texto += `Cliente: ${s.cliente.nombre} ${s.cliente.telefono}\n`
        }
        if (s.cliente.observacion) {
          texto += `Obs: ${s.cliente.observacion}\n`
        }
        texto += "\n"
      })
    }

    if (transferencia.length) {
      texto += "🏦 TRANSFERENCIA:\n"
      transferencia.forEach(s => {
        texto += `${s.item} – ${s.nombreProducto} – $${s.precio.toLocaleString()}\n`
        if (s.cliente.nombre || s.cliente.telefono) {
          texto += `Cliente: ${s.cliente.nombre} ${s.cliente.telefono}\n`
        }
        if (s.cliente.observacion) {
          texto += `Obs: ${s.cliente.observacion}\n`
        }
        texto += "\n"
      })
    }

    return texto
  }

  const copiarReporte = () => {
    navigator.clipboard.writeText(generarReporte())
    alert("Reporte copiado. Pégalo en WhatsApp 👍")
  }

  // ---------- UI ----------
  return (
    <div style={{
      maxWidth: "480px",
      margin: "0 auto",
      padding: "12px",
      backgroundColor: colores.fondo,
      minHeight: "100vh"
    }}>
      <h1 style={{
        textAlign: "center",
        color: colores.azul,
        marginBottom: "20px"
      }}>
        LUVAUS
      </h1>

      {productos.map(p => (
        <div key={p.item} style={{
          backgroundColor: colores.tarjeta,
          border: `1px solid ${colores.borde}`,
          borderRadius: "12px",
          padding: "12px",
          marginBottom: "12px"
        }}>
          <div
            onClick={() =>
              setProductoPrecioVisible(
                productoPrecioVisible === p.item ? null : p.item
              )
            }
            style={{
              color: colores.texto,
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {p.item} – {p.nombre}
          </div>

          {productoPrecioVisible === p.item && (
            <div style={{
              color: colores.azul,
              fontWeight: "bold",
              margin: "6px 0"
            }}>
              💰 Precio: ${p.precio.toLocaleString()}
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              style={{
                flex: 1,
                backgroundColor: colores.efectivo,
                color: colores.blanco,
                border: "none",
                borderRadius: "8px",
                padding: "10px"
              }}
              onClick={() => registrarSalida(p, "efectivo")}
            >
              Efectivo
            </button>

            <button
              style={{
                flex: 1,
                backgroundColor: colores.transferencia,
                color: colores.blanco,
                border: "none",
                borderRadius: "8px",
                padding: "10px"
              }}
              onClick={() => registrarSalida(p, "transferencia")}
            >
              Transferencia
            </button>
          </div>
        </div>
      ))}

      <button
        style={{
          width: "100%",
          backgroundColor: colores.azul,
          color: colores.blanco,
          border: "none",
          borderRadius: "10px",
          padding: "12px",
          marginTop: "10px"
        }}
        onClick={() => setMostrarReporte(!mostrarReporte)}
      >
        📄 {mostrarReporte ? "Ocultar reporte" : "Ver reporte"}
      </button>

      {mostrarReporte && (
        <>
          <button
            style={{ width: "100%", marginTop: "8px" }}
            onClick={copiarReporte}
          >
            Copiar reporte
          </button>

          <pre style={{ whiteSpace: "pre-wrap", marginTop: "10px" }}>
            {generarReporte()}
          </pre>
        </>
      )}
    </div>
  )
}

export default App
