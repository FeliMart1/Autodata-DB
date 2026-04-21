ALTER TABLE [EquipamientoModelo] ALTER COLUMN [VelocidadCrucero] NVARCHAR(150);
UPDATE [EquipamientoModelo] SET [VelocidadCrucero] = 'Si' WHERE [VelocidadCrucero] = '1';
UPDATE [EquipamientoModelo] SET [VelocidadCrucero] = 'No' WHERE [VelocidadCrucero] = '0';
