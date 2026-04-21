-- Transform bit columns to nvarchar to support newly added non-binary options 
-- mapped from the frontend FormularioEquipamiento

-- EPedal
ALTER TABLE [EquipamientoModelo] ALTER COLUMN [EPedal] NVARCHAR(150);
UPDATE [EquipamientoModelo] SET [EPedal] = 'Si' WHERE [EPedal] = '1';
UPDATE [EquipamientoModelo] SET [EPedal] = 'No' WHERE [EPedal] = '0';

-- ABAG
ALTER TABLE [EquipamientoModelo] ALTER COLUMN [ABAG] NVARCHAR(150);
-- previously bit, 1 = ? probably "Si" or just 2. Let's map 1 to "Si" or leave as '1'
-- Wait, ABAG options: 2, 4, 6, 7, 8, 10, 12, No. Let's map '0' to 'No' and '1' to '2' or something. 
UPDATE [EquipamientoModelo] SET [ABAG] = 'No' WHERE [ABAG] = '0';
-- if it was 1, we can't be sure how many bags. Just let '1' remain? Or 'Si'? 

-- Velcrucero
ALTER TABLE [EquipamientoModelo] ALTER COLUMN [Velcrucero] NVARCHAR(150);
UPDATE [EquipamientoModelo] SET [Velcrucero] = 'Si' WHERE [Velcrucero] = '1';
UPDATE [EquipamientoModelo] SET [Velcrucero] = 'No' WHERE [Velcrucero] = '0';

-- AsientoelectCalefMasaje
ALTER TABLE [EquipamientoModelo] ALTER COLUMN [AsientoelectCalefMasaje] NVARCHAR(150);
UPDATE [EquipamientoModelo] SET [AsientoelectCalefMasaje] = 'Si' WHERE [AsientoelectCalefMasaje] = '1';
UPDATE [EquipamientoModelo] SET [AsientoelectCalefMasaje] = 'No' WHERE [AsientoelectCalefMasaje] = '0';

-- MaleteraAperturaElectrica
ALTER TABLE [EquipamientoModelo] ALTER COLUMN [MaleteraAperturaElectrica] NVARCHAR(150);
UPDATE [EquipamientoModelo] SET [MaleteraAperturaElectrica] = 'Motorizada' WHERE [MaleteraAperturaElectrica] = '1';
UPDATE [EquipamientoModelo] SET [MaleteraAperturaElectrica] = 'No' WHERE [MaleteraAperturaElectrica] = '0';

