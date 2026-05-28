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
    // Orden exacto de las 189 columnas de la Plantilla Maestra
    const TEMPLATE_HEADERS = [
      "CODCONCATENADO","Marca","Codigo_Marca","Codigo_Modelo","Descripcion_Modelo","Familia","Combustible","Categoria","Precio_USD",
      "Largo","Ancho","Altura","DistanciaEjes","PesoOrdenMarcha","KgPorHP","Neumaticos","LlantasAleacion","DiametroLlantas","TPMS",
      "KitInflableAntiPinchazo","RuedaAuxHomogenea","Cilindros","Valvulas","Inyeccion","Traccion","Suspension","Caja","MarchasVelocidades",
      "Turbo","NumeroPuertas","Aceite","Norma","StartStop","CO2_g_km","ConsumoRuta","ConsumoUrbano","ConsumoMixto","GarantiaAnios",
      "GarantiaKm","GarantiasDiferenciales","TipoVehiculoElectrico","EPedal","CapacidadTanqueHidrogeno","AutonomiaMaxRange","CicloNorma",
      "PotenciaMotor","CapacidadOperativaBateria","ParMotorTorque","PotenciaCargaMax","TiposConectores","GarantiaCapBat","TecnologiaBat",
      "OtrosDatos","TiempoCarga","CodigoFichaTecnica","SistemaClimatizacion","Direccion","TipoBloqueo","KeylessSmartKey","LevantaVidrios",
      "EspejosElectricos","EspejoInteriorElectrocromado","EspejosAbatiblesElectricamente","Tapizado","VolanteRevestidoCuero","TablerDigital",
      "Computadora","GPS","VelocidadCrucero","Inmovilizador","Alarma","ABAG","SRI","ABS","EBD_EBV_REF","DiscosFrenos",
      "FrenoEstacionamientoElectrico","ESP_ControlEstabilidad","ControlTraccion","AsistFrenadoDetectorDistancia","AsistPendiente",
      "DetectorCambioFila","DetectorPuntoCiego","TrafficSignRecognition","DriverAttentionControl","DetectorLluvia","GripControl",
      "LimitadorVelocidad","AsistDescensoHDC","PaddleShift","ComandoAudioVolante","CD","MP3","USB","Bluetooth","DVD","MirrorScreen",
      "SistemaMultimedia","PantallaMultimediaPulgadas","PantallaTactil","CargadorSmartphoneInduccion","KitHiFi","Radio","NumeroAsientos",
      "AsientoElectricoCalefMasaje","AsientosRango2y3","Asiento2Mas1","ButacaElectrica","AsientoVentilado","AsientosMasajeador",
      "ApoyabrazosDelantero","ApoyabrazosCentralTrasero","SoporteMusloDelantero","AsientoTraseroAjusteElectrico",
      "C_3raFiladeasientoselctricos","TipoAlturaAsientoDelantero","SeatAdjustmentMemoryDriver","SeatAdjustmentMemoryCoDriver",
      "LumbarAdjustmentFrontDriver","LumbarAdjustmentFrontCoDriver","SeatHeatingRear","Techo","TechoBiTono","BarrasTecho",
      "NumeroTechosQueSeAbren","SensorEstacionamiento","Camara","SistemaAutomaticoEstacionamiento","FarosNeblina","FarosDireccionales",
      "FarosFullLED","FarosHalogenosDRL_LED","FarosXenonLimpiadores","PackVisibilidad","PasoLucesCruzRutaAutomatica","VisionNocturna",
      "FarosMatrix","LucesTraserasLED","LucesTraserasOLED","MaleteraAperturaElectrica","CapacidadBaul","CapacidadTanqueCombustible",
      "ProtectorCaja","ParticionCabina","NumPuertasLaterales","PuertaLateralElectrica","CargaUtil_kg","VolumenUtil_m3","TipoAlturaUL",
      "CapacidadCargaCamiones","AlertaTraficoCruzadoTrasero","AlertaTraficoCruzadoFrontal","FrenadoMulticolision","HeadUpDisplay",
      "CityStop","FrenoPeatones","BloqueDiferencialTerreno","DesempaniadorElectrico","IluminacionAmbiental","LimpiaLavaParabrisasTrasero",
      "BlackWheelFrame","VolanteMultifuncion","TablerDigital3D","AceleracionBEV_0a100","AccelerationICE","CargaElectricaWireless",
      "CargaElectricaInduccion","CableElectricoTipo3Incluido","ChassisDriveSelect","ChassisSportSuspension","DireccionCuatroRuedas",
      "LucesLaser","DashboardDisplayConfigurable","WirelessSmartphoneIntegration","MobilePhoneAntenna","DeflectorViento","AsientosDeportivos",
      "TIPO2Carrocera","ORIGEN","HPCV","Bloqueodiferencialporterreno","Asientosconmasajeadornmero","AutonomadelmotorelctricoBEVyPHEV",
      "Apoyabrazocentraldeasientotrasero","CC","Tipo Motor","Tipo Caja Automática","Tipo","Importador"
    ];

    // Columnas de equipamiento (posiciones 10-177 del template, índices 9-176 del array)
    // Nombre en template → nombre en DB (EquipamientoModelo). La mayoría es idéntico salvo la excepción indicada.
    const EQUIP_COLS = [
      "Largo","Ancho","Altura","DistanciaEjes","PesoOrdenMarcha","KgPorHP","Neumaticos","LlantasAleacion","DiametroLlantas","TPMS",
      "KitInflableAntiPinchazo","RuedaAuxHomogenea","Cilindros","Valvulas","Inyeccion","Traccion","Suspension","Caja","MarchasVelocidades",
      "Turbo","NumeroPuertas","Aceite","Norma","StartStop","CO2_g_km","ConsumoRuta","ConsumoUrbano","ConsumoMixto","GarantiaAnios",
      "GarantiaKm","GarantiasDiferenciales","TipoVehiculoElectrico","EPedal","CapacidadTanqueHidrogeno","AutonomiaMaxRange","CicloNorma",
      "PotenciaMotor","CapacidadOperativaBateria","ParMotorTorque","PotenciaCargaMax","TiposConectores","GarantiaCapBat","TecnologiaBat",
      "OtrosDatos","TiempoCarga","CodigoFichaTecnica","SistemaClimatizacion","Direccion","TipoBloqueo","KeylessSmartKey","LevantaVidrios",
      "EspejosElectricos","EspejoInteriorElectrocromado","EspejosAbatiblesElectricamente","Tapizado","VolanteRevestidoCuero","TablerDigital",
      "Computadora","GPS","VelocidadCrucero","Inmovilizador","Alarma","ABAG","SRI","ABS","EBD_EBV_REF","DiscosFrenos",
      "FrenoEstacionamientoElectrico","ESP_ControlEstabilidad","ControlTraccion","AsistFrenadoDetectorDistancia","AsistPendiente",
      "DetectorCambioFila","DetectorPuntoCiego","TrafficSignRecognition","DriverAttentionControl","DetectorLluvia","GripControl",
      "LimitadorVelocidad","AsistDescensoHDC","PaddleShift","ComandoAudioVolante","CD","MP3","USB","Bluetooth","DVD","MirrorScreen",
      "SistemaMultimedia","PantallaMultimediaPulgadas","PantallaTactil","CargadorSmartphoneInduccion","KitHiFi","Radio","NumeroAsientos",
      "AsientoElectricoCalefMasaje","AsientosRango2y3","Asiento2Mas1","ButacaElectrica","AsientoVentilado","AsientosMasajeador",
      "ApoyabrazosDelantero","ApoyabrazosCentralTrasero","SoporteMusloDelantero","AsientoTraseroAjusteElectrico",
      "TerceraFilaAsientosElectricos", // DB: TerceraFilaAsientosElectricos → template: C_3raFiladeasientoselctricos
      "TipoAlturaAsientoDelantero","SeatAdjustmentMemoryDriver","SeatAdjustmentMemoryCoDriver",
      "LumbarAdjustmentFrontDriver","LumbarAdjustmentFrontCoDriver","SeatHeatingRear","Techo","TechoBiTono","BarrasTecho",
      "NumeroTechosQueSeAbren","SensorEstacionamiento","Camara","SistemaAutomaticoEstacionamiento","FarosNeblina","FarosDireccionales",
      "FarosFullLED","FarosHalogenosDRL_LED","FarosXenonLimpiadores","PackVisibilidad","PasoLucesCruzRutaAutomatica","VisionNocturna",
      "FarosMatrix","LucesTraserasLED","LucesTraserasOLED","MaleteraAperturaElectrica","CapacidadBaul","CapacidadTanqueCombustible",
      "ProtectorCaja","ParticionCabina","NumPuertasLaterales","PuertaLateralElectrica","CargaUtil_kg","VolumenUtil_m3","TipoAlturaUL",
      "CapacidadCargaCamiones","AlertaTraficoCruzadoTrasero","AlertaTraficoCruzadoFrontal","FrenadoMulticolision","HeadUpDisplay",
      "CityStop","FrenoPeatones","BloqueDiferencialTerreno","DesempaniadorElectrico","IluminacionAmbiental","LimpiaLavaParabrisasTrasero",
      "BlackWheelFrame","VolanteMultifuncion","TablerDigital3D","AceleracionBEV_0a100","AccelerationICE","CargaElectricaWireless",
      "CargaElectricaInduccion","CableElectricoTipo3Incluido","ChassisDriveSelect","ChassisSportSuspension","DireccionCuatroRuedas",
      "LucesLaser","DashboardDisplayConfigurable","WirelessSmartphoneIntegration","MobilePhoneAntenna","DeflectorViento","AsientosDeportivos"
    ]; // 168 columnas (posiciones template 10..177)

    const equipSelectSQL = EQUIP_COLS.map(c => `e.[${c}]`).join(',\n        ');

    const query = `
      SELECT
        mo.CodigoAutodata         AS __cod,
        ma.Descripcion            AS __marca,
        ma.CodigoMarca            AS __codmarca,
        mo.CodigoModelo           AS __codmodelo,
        mo.DescripcionModelo      AS __descmodelo,
        mo.Familia                AS __familia,
        mo.CombustibleCodigo      AS __combustible,
        mo.SegmentacionAutodata   AS __categoria,
        mo.PrecioInicial          AS __precio,
        ${equipSelectSQL},
        ISNULL(e.TIPO2Carrocera, mo.Carroceria)  AS __carroceria,
        ISNULL(e.ORIGEN, mo.OrigenCodigo)         AS __origen,
        ISNULL(e.HPCV, mo.HP)                     AS __hp,
        NULL                                       AS __bloqueo,
        NULL                                       AS __asientosmasaje,
        NULL                                       AS __autonomia,
        NULL                                       AS __apoyabrazo,
        mo.CC                     AS __cc,
        mo.TipoMotor              AS __tipomotor,
        mo.TipoCaja               AS __tipocaja,
        mo.CategoriaCodigo        AS __tipo,
        mo.Importador             AS __importador
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

    // Función para convertir booleanos a Si/No
    const fmtBool = (v) => {
      if (v === true || v === 1) return 'Si';
      if (v === false || v === 0) return 'No';
      return v;
    };

    // Construir filas como arrays de 189 valores en el orden del template
    const dataRows = datos.map(row => {
      const base = [
        row.__cod, row.__marca, row.__codmarca, row.__codmodelo, row.__descmodelo,
        row.__familia, row.__combustible, row.__categoria, row.__precio
      ];
      // Equipamiento (168 cols)
      const equip = EQUIP_COLS.map(col => fmtBool(row[col]));
      // Últimas 12 cols
      const tail = [
        row.__carroceria, row.__origen, row.__hp,
        row.__bloqueo, row.__asientosmasaje, row.__autonomia, row.__apoyabrazo,
        row.__cc, row.__tipomotor, row.__tipocaja, row.__tipo, row.__importador
      ];
      return [...base, ...equip, ...tail];
    });

    // Fila 1: números de columna (1..189), Fila 2: headers, Fila 3+: datos
    const numberRow = TEMPLATE_HEADERS.map((_, i) => i + 1);
    const aoa = [numberRow, TEMPLATE_HEADERS, ...dataRows];

    const wb = xl.utils.book_new();
    const ws = xl.utils.aoa_to_sheet(aoa);
    xl.utils.book_append_sheet(wb, ws, 'Plantilla Maestra');

    const buffer = xl.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', `attachment; filename=Autodata_Plantilla_Maestra.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(200).send(buffer);

  } catch (error) {
    logger.error('Error exportando plantilla maestra:', error);
    res.status(500).json({ success: false, message: 'Error interno exportando datos', error: error.message });
  }
};
