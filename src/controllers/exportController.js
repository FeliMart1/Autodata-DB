const xl = require('xlsx');
const db = require('../config/db-simple');
const logger = require('../config/logger');

exports.exportarVentasExcel = async (req, res) => {
  try {
    const { anio, mes } = req.query;

    if (!anio || !mes) {
      return res.status(400).json({ success: false, message: 'Año y mes son requeridos' });
    }

    const query = `
      SELECT 
        m.CodigoAutodata AS [CODIGO CONCATENADO],
        v.Anio AS [AÑO],
        v.Mes AS [MES],
        -- Generar fecha aproximada como string DD/MM/YY
        RIGHT('0' + CAST(v.Mes AS VARCHAR(2)), 2) + '/01/' + RIGHT(CAST(v.Anio AS VARCHAR(4)), 2) AS [FECHA],
        v.Cantidad AS [VENTAS],
        ISNULL(m.PrecioInicial, 0) AS [PRECIO],
        (v.Cantidad * ISNULL(m.PrecioInicial, 0)) AS [USD],
        ISNULL(m.Tipo, m.CategoriaCodigo) AS [TIPO],
        ISNULL(m.SegmentacionAutodata, '') AS [SEGMENTO]
      FROM Venta v
      JOIN Modelo m ON v.ModeloID = m.ModeloID
      WHERE v.Anio = @p0 AND v.Mes = @p1
    `;

    const ventas = await db.queryWithParams(query, [anio, mes]);

    if (!ventas || ventas.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron ventas para el periodo especificado' });
    }

    const wb = xl.utils.book_new();
    const ws = xl.utils.json_to_sheet(ventas);
    xl.utils.book_append_sheet(wb, ws, 'Ventas');

    const buffer = xl.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=Ventas_${anio}_${mes}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(200).send(buffer);

  } catch (error) {
    logger.error('Error exportando ventas:', error);
    res.status(500).json({ success: false, message: 'Error interno exportando datos', error: error.message });
  }
};

exports.exportarEmpadronamientosExcel = async (req, res) => {
  try {
    const { anio, mes } = req.query;

    if (!anio || !mes) {
      return res.status(400).json({ success: false, message: 'Año y mes son requeridos' });
    }

    const query = `
      SELECT 
        m.CodigoAutodata AS [CODIGO MODELO],
        e.Mes AS [Mes],
        -- En el Excel del usuario la FECHA es un serial date de Excel o string, enviaremos en formato fecha
        RIGHT('0' + CAST(e.Mes AS VARCHAR(2)), 2) + '/01/' + RIGHT(CAST(e.Anio AS VARCHAR(4)), 2) AS [FECHA],
        UPPER(ISNULL(d.Nombre, '')) AS [Departamento],
        e.Cantidad AS [CANTIDAD]
      FROM Empadronamiento e
      JOIN Modelo m ON e.ModeloID = m.ModeloID
      JOIN Departamento d ON e.DepartamentoID = d.DepartamentoID
      WHERE e.Anio = @p0 AND e.Mes = @p1
    `;

    const empadronamientos = await db.queryWithParams(query, [anio, mes]);

    if (!empadronamientos || empadronamientos.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron empadronamientos para el periodo especificado' });
    }

    const wb = xl.utils.book_new();
    const ws = xl.utils.json_to_sheet(empadronamientos);
    xl.utils.book_append_sheet(wb, ws, 'Empadronamiento');

    const buffer = xl.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=Empadronamientos_${anio}_${mes}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(200).send(buffer);

  } catch (error) {
    logger.error('Error exportando empadronamientos:', error);
    res.status(500).json({ success: false, message: 'Error interno exportando datos', error: error.message });
  }
};

exports.exportarPlantillaMaestra = async (req, res) => {
  try {
    const query = `
      SELECT
        mo.CodigoAutodata        AS [CODCONCATENADO],
        ma.Descripcion           AS [Marca],
        ma.CodigoMarca           AS [Codigo_Marca],
        mo.CodigoModelo          AS [Codigo_Modelo],
        mo.DescripcionModelo     AS [Descripcion_Modelo],
        mo.Familia               AS [Familia],
        mo.CombustibleCodigo     AS [Combustible],
        mo.SegmentacionAutodata  AS [Categoria],
        mo.PrecioInicial         AS [Precio_USD],
        e.[Largo],
        e.[Ancho],
        e.[Altura],
        e.[DistanciaEjes],
        e.[PesoOrdenMarcha],
        e.[KgPorHP],
        e.[Neumaticos],
        e.[LlantasAleacion],
        e.[DiametroLlantas],
        e.[TPMS],
        e.[KitInflableAntiPinchazo],
        e.[RuedaAuxHomogenea],
        e.[Cilindros],
        e.[Valvulas],
        e.[Inyeccion],
        e.[Traccion],
        e.[Suspension],
        mo.TipoCajaAut           AS [Caja],
        e.[MarchasVelocidades],
        e.[Turbo],
        e.[NumeroPuertas],
        e.[Aceite],
        e.[Norma],
        e.[StartStop],
        e.[CO2_g_km],
        e.[ConsumoRuta],
        e.[ConsumoUrbano],
        e.[ConsumoMixto],
        e.[GarantiaAnios],
        e.[GarantiaKm],
        e.[GarantiasDiferenciales],
        e.[TipoVehiculoElectrico],
        e.[EPedal],
        e.[CapacidadTanqueHidrogeno],
        e.[AutonomiaMaxRange],
        e.[CicloNorma],
        e.[PotenciaMotor],
        e.[CapacidadOperativaBateria],
        e.[ParMotorTorque],
        e.[PotenciaCargaMax],
        e.[TiposConectores],
        e.[GarantiaCapBat],
        e.[TecnologiaBat],
        e.[OtrosDatos],
        e.[TiempoCarga],
        e.[CodigoFichaTecnica],
        e.[SistemaClimatizacion],
        e.[Direccion],
        e.[TipoBloqueo],
        e.[KeylessSmartKey],
        e.[LevantaVidrios],
        e.[EspejosElectricos],
        e.[EspejoInteriorElectrocromado],
        e.[EspejosAbatiblesElectricamente],
        e.[Tapizado],
        e.[VolanteRevestidoCuero],
        e.[TablerDigital],
        e.[Computadora],
        e.[GPS],
        e.[VelocidadCrucero],
        e.[Inmovilizador],
        e.[Alarma],
        e.[ABAG],
        e.[SRI],
        e.[ABS],
        e.[EBD_EBV_REF],
        e.[DiscosFrenos],
        e.[FrenoEstacionamientoElectrico],
        e.[ESP_ControlEstabilidad],
        e.[ControlTraccion],
        e.[AsistFrenadoDetectorDistancia],
        e.[AsistPendiente],
        e.[DetectorCambioFila],
        e.[DetectorPuntoCiego],
        e.[TrafficSignRecognition],
        e.[DriverAttentionControl],
        e.[DetectorLluvia],
        e.[GripControl],
        e.[LimitadorVelocidad],
        e.[AsistDescensoHDC],
        e.[PaddleShift],
        e.[ComandoAudioVolante],
        e.[CD],
        e.[MP3],
        e.[USB],
        e.[Bluetooth],
        e.[DVD],
        e.[MirrorScreen],
        e.[SistemaMultimedia],
        e.[PantallaMultimediaPulgadas],
        e.[PantallaTactil],
        e.[CargadorSmartphoneInduccion],
        e.[KitHiFi],
        e.[Radio],
        e.[NumeroAsientos],
        e.[AsientoElectricoCalefMasaje],
        e.[AsientosRango2y3],
        e.[Asiento2Mas1],
        e.[ButacaElectrica],
        e.[AsientoVentilado],
        e.[AsientosMasajeador],
        e.[ApoyabrazosDelantero],
        e.[ApoyabrazosCentralTrasero],
        e.[SoporteMusloDelantero],
        e.[AsientoTraseroAjusteElectrico],
        e.[C_3raFiladeasientoselctricos],
        e.[TipoAlturaAsientoDelantero],
        e.[SeatAdjustmentMemoryDriver],
        e.[SeatAdjustmentMemoryCoDriver],
        e.[LumbarAdjustmentFrontDriver],
        e.[LumbarAdjustmentFrontCoDriver],
        e.[SeatHeatingRear],
        e.[Techo],
        e.[TechoBiTono],
        e.[BarrasTecho],
        e.[NumeroTechosQueSeAbren],
        e.[SensorEstacionamiento],
        e.[Camara],
        e.[SistemaAutomaticoEstacionamiento],
        e.[FarosNeblina],
        e.[FarosDireccionales],
        e.[FarosFullLED],
        e.[FarosHalogenosDRL_LED],
        e.[FarosXenonLimpiadores],
        e.[PackVisibilidad],
        e.[PasoLucesCruzRutaAutomatica],
        e.[VisionNocturna],
        e.[FarosMatrix],
        e.[LucesTraserasLED],
        e.[LucesTraserasOLED],
        e.[MaleteraAperturaElectrica],
        e.[CapacidadBaul],
        e.[CapacidadTanqueCombustible],
        e.[ProtectorCaja],
        e.[ParticionCabina],
        e.[NumPuertasLaterales],
        e.[PuertaLateralElectrica],
        e.[CargaUtil_kg],
        e.[VolumenUtil_m3],
        e.[TipoAlturaUL],
        e.[CapacidadCargaCamiones],
        e.[AlertaTraficoCruzadoTrasero],
        e.[AlertaTraficoCruzadoFrontal],
        e.[FrenadoMulticolision],
        e.[HeadUpDisplay],
        e.[CityStop],
        e.[FrenoPeatones],
        e.[BloqueDiferencialTerreno],
        e.[DesempaniadorElectrico],
        e.[IluminacionAmbiental],
        e.[LimpiaLavaParabrisasTrasero],
        e.[BlackWheelFrame],
        e.[VolanteMultifuncion],
        e.[TablerDigital3D],
        e.[AceleracionBEV_0a100],
        e.[AccelerationICE],
        e.[CargaElectricaWireless],
        e.[CargaElectricaInduccion],
        e.[CableElectricoTipo3Incluido],
        e.[ChassisDriveSelect],
        e.[ChassisSportSuspension],
        e.[DireccionCuatroRuedas],
        e.[LucesLaser],
        e.[DashboardDisplayConfigurable],
        e.[WirelessSmartphoneIntegration],
        e.[MobilePhoneAntenna],
        e.[DeflectorViento],
        e.[AsientosDeportivos],
        e.[TIPO2Carrocera],
        e.[ORIGEN],
        e.[HPCV],
        e.[Bloqueodiferencialporterreno],
        e.[Asientosconmasajeadornmero],
        e.[AutonomadelmotorelctricoBEVyPHEV],
        e.[Apoyabrazocentraldeasientotrasero],
        mo.CC                    AS [CC],
        mo.TipoMotor             AS [Tipo Motor],
        e.[Caja]                 AS [Tipo Caja Automática],
        mo.Tipo                  AS [Tipo],
        mo.Importador            AS [Importador]
      FROM Modelo mo
      INNER JOIN Marca ma ON mo.MarcaID = ma.MarcaID
      LEFT JOIN EquipamientoModelo e ON mo.ModeloID = e.ModeloID
      WHERE mo.Activo = 1
      ORDER BY ma.Descripcion, mo.DescripcionModelo
    `;

    const datos = await db.queryRaw(query);

    if (!datos || datos.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron modelos para exportar' });
    }

    const formattedData = datos.map(row => {
      const formatted = {};
      for (const [key, val] of Object.entries(row)) {
        if (val === true) formatted[key] = 'Si';
        else if (val === false) formatted[key] = 'No';
        else formatted[key] = val;
      }
      return formatted;
    });

    const wb = xl.utils.book_new();
    const ws = xl.utils.json_to_sheet(formattedData);
    xl.utils.book_append_sheet(wb, ws, 'Plantilla_Datos');

    const buffer = xl.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=Autodata_Plantilla_Maestra.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(200).send(buffer);

  } catch (error) {
    logger.error('Error exportando plantilla maestra:', error);
    res.status(500).json({ success: false, message: 'Error interno exportando datos', error: error.message });
  }
};
