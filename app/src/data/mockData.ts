import { Material } from '../api/materials';
import { Category } from '../api/categories';

// ==========================================
// MOCK DATA - Generated from SQL Dump
// ==========================================

export const MOCK_CATEGORIES: Category[] = [
    {
        categoriaId: 'cat-001',
        nombre: 'Equipos de Cómputo',
        descripcion: 'Computadoras, laptops, monitores, teclados, mouse y accesorios',
        activo: true
    },
    {
        categoriaId: 'cat-002',
        nombre: 'Herramientas',
        descripcion: 'Herramientas y equipos',
        activo: true
    },
    {
        categoriaId: 'cat-003',
        nombre: 'Materiales de Construcción',
        descripcion: 'Materiales para construcción',
        activo: true
    },
    {
        categoriaId: 'cat-004',
        nombre: 'Equipos Eléctricos',
        descripcion: 'Equipos y componentes eléctricos',
        activo: true
    },
    {
        categoriaId: 'cat-005',
        nombre: 'Suministros de Oficina',
        descripcion: 'Materiales de oficina',
        activo: true
    },
    {
        categoriaId: 'cat-006',
        nombre: 'Componentes Electrónicos',
        descripcion: 'Resistencias, capacitores, transistores, diodos y circuitos integrados',
        activo: true
    },
    {
        categoriaId: 'cat-007',
        nombre: 'Equipos de Audio',
        descripcion: 'Equipos de sonido y audio profesional',
        activo: true
    },
    {
        categoriaId: 'cat-008',
        nombre: 'Smartphones',
        descripcion: 'Teléfonos inteligentes de distintas marcas y modelos',
        activo: true
    },
    {
        categoriaId: 'cat-009',
        nombre: 'Tablets',
        descripcion: 'Tabletas y dispositivos móviles de pantalla grande',
        activo: true
    },
    {
        categoriaId: 'cat-010',
        nombre: 'Accesorios Móviles',
        descripcion: 'Fundas, protectores, cargadores y auriculares.',
        activo: true
    },
    {
        categoriaId: 'cat-011',
        nombre: 'Módems y Routers',
        descripcion: 'Equipos para conexión a internet fija y móvil',
        activo: true
    },
    {
        categoriaId: 'cat-012',
        nombre: 'SIM Cards',
        descripcion: 'Tarjetas SIM prepago y postpago',
        activo: true
    },
    {
        categoriaId: 'cat-013',
        nombre: 'Equipos de Red',
        descripcion: 'Antenas, switches, access points y equipos de infraestructura',
        activo: true
    },
    {
        categoriaId: 'cat-014',
        nombre: 'Cables y Conectores',
        descripcion: 'Cables USB, HDMI, Ethernet y conectores diversos',
        activo: true
    },
    {
        categoriaId: 'cat-015',
        nombre: 'Baterías',
        descripcion: 'Baterías para dispositivos móviles y equipos',
        activo: true
    },
    {
        categoriaId: 'cat-016',
        nombre: 'Smartwatches',
        descripcion: 'Relojes inteligentes y wearables',
        activo: true
    },
    {
        categoriaId: 'cat-017',
        nombre: 'Telefonía Fija',
        descripcion: 'Teléfonos fijos, inalámbricos y accesorios',
        activo: true
    },
    {
        categoriaId: 'cat-018',
        nombre: 'Suministros de Impresión',
        descripcion: 'Toners, cartuchos, papel',
        activo: true
    }
];

export const MOCK_MATERIALS: Material[] = [
    // Smartphones
    {
        materialId: 'mat-001',
        codigo: 'CEL-SAM-S24-256-BLK',
        nombre: 'Samsung Galaxy S24 256GB Negro',
        descripcion: 'Smartphone Samsung Galaxy S24, 256GB almacenamiento, 8GB RAM, pantalla 6.2", color negro',
        categoriaId: 'cat-008', // Smartphones
        categoriaNombre: 'Smartphones',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 150,
        stockTotal: 150
    },
    {
        materialId: 'mat-002',
        codigo: 'CEL-SAM-S24-256-GRY',
        nombre: 'Samsung Galaxy S24 256GB Gris',
        descripcion: 'Smartphone Samsung Galaxy S24, 256GB almacenamiento, 8GB RAM, pantalla 6.2", color gris',
        categoriaId: 'cat-008',
        categoriaNombre: 'Smartphones',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 120,
        stockTotal: 120
    },
    {
        materialId: 'mat-003',
        codigo: 'CEL-IPH-15-128-BLK',
        nombre: 'iPhone 15 128GB Negro',
        descripcion: 'Apple iPhone 15, 128GB almacenamiento, chip A16 Bionic, pantalla 6.1", color negro',
        categoriaId: 'cat-008',
        categoriaNombre: 'Smartphones',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 200,
        stockTotal: 200
    },
    {
        materialId: 'mat-004',
        codigo: 'CEL-IPH-15-256-BLU',
        nombre: 'iPhone 15 256GB Azul',
        descripcion: 'Apple iPhone 15, 256GB almacenamiento, chip A16 Bionic, pantalla 6.1", color azul',
        categoriaId: 'cat-008',
        categoriaNombre: 'Smartphones',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 180,
        stockTotal: 180
    },
    {
        materialId: 'mat-005',
        codigo: 'CEL-XIA-RED13-128',
        nombre: 'Xiaomi Redmi Note 13 128GB',
        descripcion: 'Smartphone Xiaomi Redmi Note 13, 128GB almacenamiento, 6GB RAM, pantalla 6.67"',
        categoriaId: 'cat-008',
        categoriaNombre: 'Smartphones',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 300,
        stockTotal: 300
    },

    // Tablets
    {
        materialId: 'mat-101',
        codigo: 'TAB-SAM-S9-128-GRY',
        nombre: 'Samsung Galaxy Tab S9 128GB',
        descripcion: 'Tablet Samsung Galaxy Tab S9, 128GB almacenamiento, pantalla 11", color gris',
        categoriaId: 'cat-009', // Tablets
        categoriaNombre: 'Tablets',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 80,
        stockTotal: 80
    },
    {
        materialId: 'mat-102',
        codigo: 'TAB-IPD-AIR-256',
        nombre: 'iPad Air 256GB',
        descripcion: 'Apple iPad Air, 256GB almacenamiento, chip M1, pantalla 10.9"',
        categoriaId: 'cat-009',
        categoriaNombre: 'Tablets',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 100,
        stockTotal: 100
    },

    // Accesorios
    {
        materialId: 'mat-201',
        codigo: 'ACC-CARG-USB-C-20W',
        nombre: 'Cargador USB-C 20W',
        descripcion: 'Cargador rápido USB-C 20W compatible con smartphones',
        categoriaId: 'cat-010', // Accesorios Móviles
        categoriaNombre: 'Accesorios Móviles',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 800,
        stockTotal: 800
    },
    {
        materialId: 'mat-202',
        codigo: 'ACC-CABLE-USC-1M',
        nombre: 'Cable USB-C 1 metro',
        descripcion: 'Cable USB-C a USB-C 1 metro, carga rápida',
        categoriaId: 'cat-010',
        categoriaNombre: 'Accesorios Móviles',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 1000,
        stockTotal: 1000
    },

    // Redes
    {
        materialId: 'mat-301',
        codigo: 'NET-ROUT-WIFI6-AX3000',
        nombre: 'Router WiFi 6 AX3000',
        descripcion: 'Router inalámbrico WiFi 6, velocidad AX3000, 4 puertos Gigabit',
        categoriaId: 'cat-011', // Módems y Routers
        categoriaNombre: 'Módems y Routers',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 200,
        stockTotal: 200
    },
    {
        materialId: 'mat-302',
        codigo: 'NET-MOD-4G-LTE',
        nombre: 'Módem 4G LTE Portátil',
        descripcion: 'Módem portátil 4G LTE con batería integrada',
        categoriaId: 'cat-011',
        categoriaNombre: 'Módems y Routers',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 150,
        stockTotal: 150
    },

    // SIM Cards
    {
        materialId: 'mat-401',
        codigo: 'SIM-PREPAGO-STD',
        nombre: 'SIM Card Prepago Estándar',
        descripcion: 'Tarjeta SIM triple corte prepago',
        categoriaId: 'cat-012', // SIM Cards
        categoriaNombre: 'SIM Cards',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 3400,
        stockTotal: 3400
    },
    {
        materialId: 'mat-402',
        codigo: 'SIM-POSTPAGO-STD',
        nombre: 'SIM Card Postpago Estándar',
        descripcion: 'Tarjeta SIM triple corte postpago',
        categoriaId: 'cat-012',
        categoriaNombre: 'SIM Cards',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 3000,
        stockTotal: 3000
    },

    // Infraestructura
    {
        materialId: 'mat-501',
        codigo: 'RED-SW-8P-GIG',
        nombre: 'Switch 8 Puertos Gigabit',
        descripcion: 'Switch no administrable 8 puertos Gigabit Ethernet',
        categoriaId: 'cat-013', // Equipos de Red
        categoriaNombre: 'Equipos de Red',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 100,
        stockTotal: 100
    },
    {
        materialId: 'mat-502',
        codigo: 'RED-AP-WIFI6-IN',
        nombre: 'Access Point WiFi 6 Indoor',
        descripcion: 'Punto de acceso WiFi 6 para interiores',
        categoriaId: 'cat-013',
        categoriaNombre: 'Equipos de Red',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 140,
        stockTotal: 140
    },

    // Cables
    {
        materialId: 'mat-601',
        codigo: 'CAB-ETH-CAT6-1M',
        nombre: 'Cable Ethernet Cat6 1m',
        descripcion: 'Cable de red Ethernet categoría 6, 1 metro',
        categoriaId: 'cat-014', // Cables y Conectores
        categoriaNombre: 'Cables y Conectores',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 2400,
        stockTotal: 2400
    },
    {
        materialId: 'mat-602',
        codigo: 'CAB-FIB-OPT-10M',
        nombre: 'Cable Fibra Óptica 10m',
        descripcion: 'Cable de fibra óptica monomodo SC/SC 10 metros',
        categoriaId: 'cat-014', // Cables y Conectores
        categoriaNombre: 'Cables y Conectores',
        unidadBaseId: 'und-001',
        unidadBaseSimbolo: 'und',
        activo: true,
        stockDisponible: 300,
        stockTotal: 300
    }
];
