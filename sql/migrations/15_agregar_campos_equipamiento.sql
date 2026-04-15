-- Migracion generada dinamicamente
-- Agrega campos faltantes en EquipamientoModelo

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'TIPO2Carrocera'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [TIPO2Carrocera] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'ORIGEN'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [ORIGEN] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'COMBUSTIBLE'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [COMBUSTIBLE] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'DistEjes'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [DistEjes] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Pesoenordendemarcha'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Pesoenordendemarcha] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'kghp'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [kghp] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Neumticos'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Neumticos] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Llantasdealeacin'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Llantasdealeacin] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Dimetrollantas'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Dimetrollantas] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'TPMSMonitoreopresindeneumticos'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [TPMSMonitoreopresindeneumticos] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Ruedaauxhomogeneo'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Ruedaauxhomogeneo] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Vlvulas'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Vlvulas] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'HPCV'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [HPCV] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Iny'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Iny] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Traccin'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Traccin] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Suspensin'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Suspensin] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Ndepuertas'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Ndepuertas] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Consumorutal100km'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Consumorutal100km] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Consumourbanol100km'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Consumourbanol100km] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Consumomixtol100km'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Consumomixtol100km] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Garantaenaos'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Garantaenaos] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'GarantaenKm'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [GarantaenKm] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Garantasdiferenciales'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Garantasdiferenciales] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'TipodeVehiculoElectricoHibrido'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [TipodeVehiculoElectricoHibrido] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'CapTanqueHidrgeno'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [CapTanqueHidrgeno] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'AutonomaMaxRangeenkilometros'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [AutonomaMaxRangeenkilometros] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'PotenciamotorKW'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [PotenciamotorKW] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'CapoperativabatBatterycapacityKwh'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [CapoperativabatBatterycapacityKwh] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'PardelMotortorqueNm'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [PardelMotortorqueNm] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'PotenciadecargaPotMxKWenCA'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [PotenciadecargaPotMxKWenCA] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Tiposdeconectores'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Tiposdeconectores] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'GarantacapBat'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [GarantacapBat] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'TecnologaBatmateriales'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [TecnologaBatmateriales] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Sistemadeclimatizacin'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Sistemadeclimatizacin] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Direccin'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Direccin] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Tipodebloqueo'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Tipodebloqueo] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'KeylessoSmartkey'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [KeylessoSmartkey] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Espejoselct'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Espejoselct] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'VolanterevestidoenCuero'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [VolanterevestidoenCuero] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Tablerodigital'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Tablerodigital] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Velcrucero'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Velcrucero] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Inmobilizador'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Inmobilizador] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'SRISistemaderetencininfantil'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [SRISistemaderetencininfantil] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'EBDEBVREFDistribucinelectdefrenada'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [EBDEBVREFDistribucinelectdefrenada] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'FrenoEstacionamentoElectricoEPB'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [FrenoEstacionamentoElectricoEPB] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Controltraccin'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Controltraccin] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Detcambiodefila'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Detcambiodefila] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Detpuntociego'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Detpuntociego] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Comandoaudioenvolante'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Comandoaudioenvolante] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'MirrorScreenSmartphoneDisplay'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [MirrorScreenSmartphoneDisplay] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'SistMultimedia'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [SistMultimedia] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'PantMultimedia'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [PantMultimedia] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'CargadorSmartphoneconinduccin'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [CargadorSmartphoneconinduccin] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'KitHiFiBoseJBLFocal'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [KitHiFiBoseJBLFocal] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Nmerodeasientos'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Nmerodeasientos] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'AsientoelectCalefMasaje'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [AsientoelectCalefMasaje] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'asiento21'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [asiento21] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'ButElectr'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [ButElectr] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Barrasdetecho'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Barrasdetecho] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Cmara'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Cmara] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Sistautomticodeestacionamento'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Sistautomticodeestacionamento] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Farosdeneblina'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Farosdeneblina] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'FaroshalgenosDRLLEDDiurnas'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [FaroshalgenosDRLLEDDiurnas] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'FarosxenonLimpadores'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [FarosxenonLimpadores] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'PackVisibilidadEncendidoautofaros'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [PackVisibilidadEncendidoautofaros] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'PasodelucesCruzrutaautomtica'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [PasodelucesCruzrutaautomtica] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Visinnocturna'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Visinnocturna] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Maleteraaperturaelctrica'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Maleteraaperturaelctrica] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'CapBal'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [CapBal] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'CapTanquecombustible'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [CapTanquecombustible] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Particindecabina'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Particindecabina] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'NPuertasLat'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [NPuertasLat] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'PuertalatElctrica'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [PuertalatElctrica] NVARCHAR(100);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'CargatilKg'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [CargatilKg] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Volumentilm3'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Volumentilm3] DECIMAL(10,2);
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'limitadordevelocidad'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [limitadordevelocidad] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Alertadetrficocruzadotrasero'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Alertadetrficocruzadotrasero] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Alertadetrficocruzadofrontal'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Alertadetrficocruzadofrontal] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Frenadomulticolisin'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Frenadomulticolisin] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Apoyabrazodelantero'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Apoyabrazodelantero] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Bloqueodiferencialporterreno'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Bloqueodiferencialporterreno] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Nmerodetechosqueseabren'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Nmerodetechosqueseabren] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Asientosconmasajeadornmero'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Asientosconmasajeadornmero] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'AutonomadelmotorelctricoBEVyPHEV'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [AutonomadelmotorelctricoBEVyPHEV] INT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Frenodepeatones'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Frenodepeatones] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Desempaadorelctrico'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Desempaadorelctrico] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Iluminacinambiental'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Iluminacinambiental] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Limpialavaparabrisastraseroelct'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Limpialavaparabrisastraseroelct] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Apoyabrazocentraldeasientotrasero'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Apoyabrazocentraldeasientotrasero] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Soporteparamuslodelantero'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Soporteparamuslodelantero] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Asientotraseroconajusteelctrico'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Asientotraseroconajusteelctrico] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'C_3raFiladeasientoselctricos'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [C_3raFiladeasientoselctricos] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Volantemultifuncin'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Volantemultifuncin] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Tablerodigital3D'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Tablerodigital3D] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Cargaelectricaporwireless'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Cargaelectricaporwireless] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Cargaelectricaporinduccion'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Cargaelectricaporinduccion] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Direccionenlascuatroruedas'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Direccionenlascuatroruedas] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'LucestrasOLED'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [LucestrasOLED] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Deflectordeviento'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Deflectordeviento] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'LumbarLumbaradjustmentfrontDriver'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [LumbarLumbaradjustmentfrontDriver] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'LumbarLumbaradjustmentfrontCoDriver'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [LumbarLumbaradjustmentfrontCoDriver] BIT;
END
GO

IF NOT EXISTS (
    SELECT * FROM sys.columns 
    WHERE object_id = OBJECT_ID('EquipamientoModelo') AND name = 'Precioafechadecarga'
)
BEGIN
    ALTER TABLE EquipamientoModelo ADD [Precioafechadecarga] INT;
END
GO

