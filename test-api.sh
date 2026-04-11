#!/bin/bash

# ==========================================
# 🧪 Script de Pruebas Automatizadas API
# SaaS POS Colombia
# ==========================================

BASE_URL="http://localhost:3000"
PASS=0
FAIL=0
TOTAL=0

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir resultado
test_result() {
    local name=$1
    local expected=$2
    local actual=$3
    
    TOTAL=$((TOTAL + 1))
    
    if [ "$actual" -eq "$expected" ]; then
        echo -e "${GREEN}✓ PASS${NC}: $name (Status: $actual)"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}✗ FAIL${NC}: $name (Expected: $expected, Got: $actual)"
        FAIL=$((FAIL + 1))
    fi
}

# Función para hacer request
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local cookie=$4
    
    if [ -z "$data" ]; then
        if [ -z "$cookie" ]; then
            curl -s -o /dev/null -w "%{http_code}" -X $method "${BASE_URL}${endpoint}"
        else
            curl -s -o /dev/null -w "%{http_code}" -X $method "${BASE_URL}${endpoint}" \
                -H "Cookie: $cookie"
        fi
    else
        if [ -z "$cookie" ]; then
            curl -s -o /dev/null -w "%{http_code}" -X $method "${BASE_URL}${endpoint}" \
                -H "Content-Type: application/json" \
                -d "$data"
        else
            curl -s -o /dev/null -w "%{http_code}" -X $method "${BASE_URL}${endpoint}" \
                -H "Content-Type: application/json" \
                -H "Cookie: $cookie" \
                -d "$data"
        fi
    fi
}

echo ""
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}    🧪 PRUEBAS DE API - POS COLOMBIA    ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# ==========================================
# FASE 1: Verificar Servidor
# ==========================================
echo -e "${YELLOW}📡 FASE 1: Verificando Servidor...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/setup/check" "")
test_result "Servidor responde" "200" "$STATUS"

echo ""

# ==========================================
# FASE 2: Pruebas de Setup
# ==========================================
echo -e "${YELLOW}⚙️ FASE 2: Pruebas de Setup...${NC}"
echo ""

# Verificar si hay usuarios (debe ser 200 siempre)
STATUS=$(make_request "GET" "/api/setup/check" "")
test_result "Check setup existe" "200" "$STATUS"

echo ""

# ==========================================
# FASE 3: Pruebas de Tenants (Sin Auth)
# ==========================================
echo -e "${YELLOW}🏢 FASE 3: Pruebas de Tenants...${NC}"
echo ""

# Listar tenants sin auth (debe fallar con 401)
STATUS=$(make_request "GET" "/api/tenants" "")
test_result "Tenants sin auth (debe fallar)" "401" "$STATUS"

# Crear tenant (registro público)
STATUS=$(make_request "POST" "/api/tenants" '{
    "businessName": "Tienda Test",
    "nit": "123456789",
    "ownerName": "Juan Test",
    "phone": "3001234567",
    "email": "test@test.com",
    "city": "Bogotá",
    "password": "test123456"
}')
test_result "Crear tenant" "200" "$STATUS"

echo ""

# ==========================================
# FASE 4: Pruebas de Productos (Sin Auth)
# ==========================================
echo -e "${YELLOW}📦 FASE 4: Pruebas de Productos...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/products" "")
test_result "Productos sin auth (debe fallar)" "401" "$STATUS"

STATUS=$(make_request "POST" "/api/products" '{"name": "Test", "salePrice": 1000}')
test_result "Crear producto sin auth (debe fallar)" "401" "$STATUS"

echo ""

# ==========================================
# FASE 5: Pruebas de Categorías (Sin Auth)
# ==========================================
echo -e "${YELLOW}📁 FASE 5: Pruebas de Categorías...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/categories" "")
test_result "Categorías sin auth (debe fallar)" "401" "$STATUS"

echo ""

# ==========================================
# FASE 6: Pruebas de Clientes (Sin Auth)
# ==========================================
echo -e "${YELLOW}👥 FASE 6: Pruebas de Clientes...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/customers" "")
test_result "Clientes sin auth (debe fallar)" "401" "$STATUS"

echo ""

# ==========================================
# FASE 7: Pruebas de Ventas (Sin Auth)
# ==========================================
echo -e "${YELLOW}🛒 FASE 7: Pruebas de Ventas...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/sales" "")
test_result "Ventas sin auth (debe fallar)" "401" "$STATUS"

STATUS=$(make_request "POST" "/api/sales" '{"items": [], "paymentMethod": "CASH"}')
test_result "Crear venta sin auth (debe fallar)" "401" "$STATUS"

echo ""

# ==========================================
# FASE 8: Pruebas de Créditos (Sin Auth)
# ==========================================
echo -e "${YELLOW}💳 FASE 8: Pruebas de Créditos...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/credits" "")
test_result "Créditos sin auth (debe fallar)" "401" "$STATUS"

echo ""

# ==========================================
# FASE 9: Pruebas de Caja (Sin Auth)
# ==========================================
echo -e "${YELLOW}💰 FASE 9: Pruebas de Caja...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/cash" "")
test_result "Caja sin auth (debe fallar)" "401" "$STATUS"

echo ""

# ==========================================
# FASE 10: Pruebas de Gastos (Sin Auth)
# ==========================================
echo -e "${YELLOW}🧾 FASE 10: Pruebas de Gastos...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/expenses" "")
test_result "Gastos sin auth (debe fallar)" "401" "$STATUS"

echo ""

# ==========================================
# FASE 11: Pruebas de Sucursales (Sin Auth)
# ==========================================
echo -e "${YELLOW}🏪 FASE 11: Pruebas de Sucursales...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/branches" "")
test_result "Sucursales sin auth (debe fallar)" "401" "$STATUS"

echo ""

# ==========================================
# FASE 12: Pruebas de Usuarios (Sin Auth)
# ==========================================
echo -e "${YELLOW}👤 FASE 12: Pruebas de Usuarios...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/users" "")
test_result "Usuarios sin auth (debe fallar)" "401" "$STATUS"

echo ""

# ==========================================
# FASE 13: Pruebas de Notificaciones (Sin Auth)
# ==========================================
echo -e "${YELLOW}🔔 FASE 13: Pruebas de Notificaciones...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/notifications" "")
test_result "Notificaciones sin auth (debe fallar)" "401" "$STATUS"

echo ""

# ==========================================
# FASE 14: Pruebas de Inventario (Sin Auth)
# ==========================================
echo -e "${YELLOW}📦 FASE 14: Pruebas de Inventario...${NC}"
echo ""

STATUS=$(make_request "GET" "/api/inventory" "")
test_result "Inventario sin auth (debe fallar)" "401" "$STATUS"

echo ""

# ==========================================
# RESUMEN
# ==========================================
echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}              📊 RESUMEN                ${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""
echo -e "Total de pruebas: ${TOTAL}"
echo -e "${GREEN}Pasaron: ${PASS}${NC}"
echo -e "${RED}Fallaron: ${FAIL}${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✨ ¡Todas las pruebas pasaron! ✨${NC}"
    exit 0
else
    echo -e "${RED}⚠️ Hay pruebas fallidas. Revisar los errores arriba. ⚠️${NC}"
    exit 1
fi
