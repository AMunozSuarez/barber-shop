import React, { useState } from 'react';
import { checkBackendHealth } from '../../services/api';
import { getServices } from '../../services/service.service';
import { getBarbers } from '../../services/barber.service';
import AuthService from '../../services/auth.service';

const ConnectionTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    const testResults = {};

    try {
      // Test 1: Backend Health
      console.log('🔍 Testing backend health...');
      const health = await checkBackendHealth();
      testResults.health = health;

      // Test 2: Services
      console.log('🔍 Testing services...');
      const services = await getServices();
      testResults.services = {
        success: services.success,
        count: services.data?.length || 0,
        sample: services.data?.[0]?.name || 'No services'
      };

      // Test 3: Barbers
      console.log('🔍 Testing barbers...');
      const barbers = await getBarbers();
      testResults.barbers = {
        success: barbers.success,
        count: barbers.data?.length || 0,
        sample: barbers.data?.[0]?.user?.name || 'No barbers'
      };

      // Test 4: Auth Check
      console.log('🔍 Testing auth...');
      const currentUser = AuthService.getCurrentUser();
      testResults.auth = {
        isAuthenticated: AuthService.isAuthenticated(),
        user: currentUser?.name || 'Not logged in',
        role: currentUser?.role || 'None'
      };

      console.log('✅ All tests completed!', testResults);
      setResults(testResults);
    } catch (error) {
      console.error('❌ Test failed:', error);
      testResults.error = error.message;
      setResults(testResults);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      left: '20px', 
      background: 'white', 
      border: '2px solid #ccc', 
      padding: '15px', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h3>🔧 Prueba de Conexión</h3>
      <button 
        onClick={testConnection} 
        disabled={loading}
        style={{
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Probando...' : 'Probar Conexión'}
      </button>

      {Object.keys(results).length > 0 && (
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          <h4>Resultados:</h4>
          
          {results.health && (
            <div>
              <strong>Backend:</strong> 
              <span style={{ color: results.health.status === 'connected' ? 'green' : 'red' }}>
                {results.health.status === 'connected' ? ' ✅ Conectado' : ' ❌ Desconectado'}
              </span>
            </div>
          )}
          
          {results.services && (
            <div>
              <strong>Servicios:</strong> 
              <span style={{ color: results.services.success ? 'green' : 'red' }}>
                {results.services.success ? ` ✅ ${results.services.count} servicios` : ' ❌ Error'}
              </span>
              {results.services.sample && <div>Ejemplo: {results.services.sample}</div>}
            </div>
          )}
          
          {results.barbers && (
            <div>
              <strong>Barberos:</strong> 
              <span style={{ color: results.barbers.success ? 'green' : 'red' }}>
                {results.barbers.success ? ` ✅ ${results.barbers.count} barberos` : ' ❌ Error'}
              </span>
              {results.barbers.sample && <div>Ejemplo: {results.barbers.sample}</div>}
            </div>
          )}
          
          {results.auth && (
            <div>
              <strong>Auth:</strong> 
              <span style={{ color: results.auth.isAuthenticated ? 'green' : 'orange' }}>
                {results.auth.isAuthenticated ? ' ✅ Autenticado' : ' ⚠️ No autenticado'}
              </span>
              <div>Usuario: {results.auth.user}</div>
              <div>Rol: {results.auth.role}</div>
            </div>
          )}
          
          {results.error && (
            <div style={{ color: 'red' }}>
              <strong>Error:</strong> {results.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionTest; 