import React, { useState, useEffect } from 'react';
import { getAvailableTimeSlots } from '../../services/appointment.service';
import { getBarberAppointments } from '../../services/appointment.service';

const TimeSlotsDebug = ({ selectedBarber, selectedDate, selectedService }) => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDebugInfo = async () => {
      if (!selectedBarber || !selectedDate || !selectedService) {
        setDebugInfo(null);
        return;
      }

      setIsLoading(true);
      try {
        // Obtener horarios disponibles
        const slotsResponse = await getAvailableTimeSlots(
          selectedBarber._id || selectedBarber.id,
          selectedDate,
          selectedService._id || selectedService.id
        );

        // Obtener citas existentes del barbero
        let appointmentsResponse = { success: true, data: [] };
        try {
          appointmentsResponse = await getBarberAppointments(
            selectedBarber._id || selectedBarber.id
          );
        } catch (appointmentError) {
          console.warn('⚠️ No se pudieron cargar las citas del barbero:', appointmentError.message);
          appointmentsResponse = { success: false, data: [], error: appointmentError.message };
        }

        // Filtrar citas para la fecha seleccionada
        const selectedDateObj = new Date(selectedDate);
        const appointmentsForDate = appointmentsResponse.success 
          ? appointmentsResponse.data.filter(apt => {
              const aptDate = new Date(apt.date);
              return aptDate.toDateString() === selectedDateObj.toDateString() &&
                     apt.status !== 'cancelled' && apt.status !== 'completed';
            })
          : [];

        setExistingAppointments(appointmentsForDate);
        setDebugInfo({
          slotsResponse,
          appointmentsResponse,
          appointmentsForDate,
          requestParams: {
            barberId: selectedBarber._id || selectedBarber.id,
            date: selectedDate,
            serviceId: selectedService._id || selectedService.id
          }
        });
      } catch (error) {
        console.error('Error al obtener información de debug:', error);
        setDebugInfo({ error: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDebugInfo();
  }, [selectedBarber, selectedDate, selectedService]);

  if (!selectedBarber || !selectedDate || !selectedService) {
    return (
      <div className="debug-panel" style={{ 
        padding: '15px', 
        border: '2px dashed #ccc', 
        margin: '10px 0',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px'
      }}>
        <h4>🔍 Panel de Debug - Horarios</h4>
        <p>Selecciona barbero, fecha y servicio para ver información de debug</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="debug-panel" style={{ 
        padding: '15px', 
        border: '2px dashed #007bff', 
        margin: '10px 0',
        backgroundColor: '#e7f3ff',
        borderRadius: '5px'
      }}>
        <h4>🔍 Panel de Debug - Horarios</h4>
        <p>⏳ Cargando información de debug...</p>
      </div>
    );
  }

  return (
    <div className="debug-panel" style={{ 
      padding: '15px', 
      border: '2px solid #007bff', 
      margin: '10px 0',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px',
      fontSize: '12px'
    }}>
      <h4>🔍 Panel de Debug - Horarios Disponibles</h4>
      
      <div style={{ marginBottom: '15px' }}>
        <h5>📊 Parámetros de Consulta:</h5>
        <ul>
          <li><strong>Barbero:</strong> {selectedBarber.user?.name || selectedBarber.name} (ID: {debugInfo?.requestParams?.barberId})</li>
          <li><strong>Fecha:</strong> {selectedDate}</li>
          <li><strong>Servicio:</strong> {selectedService.name} - {selectedService.duration} min (ID: {debugInfo?.requestParams?.serviceId})</li>
        </ul>
      </div>

      {debugInfo?.error ? (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          <h5>❌ Error:</h5>
          <p>{debugInfo.error}</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '15px' }}>
            <h5>📅 Citas Existentes para esta Fecha:</h5>
            {existingAppointments.length > 0 ? (
              <ul>
                {existingAppointments.map(apt => (
                  <li key={apt._id} style={{ 
                    marginBottom: '5px',
                    padding: '5px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '3px'
                  }}>
                    <strong>{apt.startTime} - {apt.endTime}</strong> | 
                    Estado: <span style={{ fontWeight: 'bold', color: apt.status === 'confirmed' ? 'green' : 'orange' }}>
                      {apt.status}
                    </span> | 
                    Cliente: {apt.client?.name || 'N/A'} |
                    Servicio: {apt.service?.name || 'N/A'}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'green' }}>✅ No hay citas existentes para esta fecha</p>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <h5>🕐 Respuesta del Backend:</h5>
            {debugInfo?.slotsResponse?.success ? (
              <>
                <p><strong>Estado:</strong> <span style={{ color: 'green' }}>✅ Exitoso</span></p>
                <p><strong>Horarios Disponibles ({debugInfo?.slotsResponse?.data?.length || 0}):</strong></p>
                {debugInfo?.slotsResponse?.data?.length > 0 ? (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
                    gap: '5px',
                    marginTop: '10px'
                  }}>
                    {debugInfo.slotsResponse.data.map((slot, index) => (
                      <span key={index} style={{
                        padding: '5px',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        borderRadius: '3px',
                        textAlign: 'center',
                        fontSize: '11px'
                      }}>
                        {slot}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'orange' }}>⚠️ No hay horarios disponibles</p>
                )}
                
                {debugInfo?.slotsResponse?.meta && (
                  <div style={{ marginTop: '10px', fontSize: '11px' }}>
                    <h6>📋 Metadata del Backend:</h6>
                    <ul>
                      <li>Horario de trabajo: {debugInfo.slotsResponse.meta.workingHours?.start} - {debugInfo.slotsResponse.meta.workingHours?.end}</li>
                      <li>Citas existentes que bloquean: {debugInfo.slotsResponse.meta.existingAppointments}</li>
                      <li>Total slots generados: {debugInfo.slotsResponse.meta.totalSlotsAvailable}</li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: 'red' }}>
                <p><strong>Estado:</strong> ❌ Error</p>
                <p><strong>Error:</strong> {debugInfo?.slotsResponse?.error || 'Error desconocido'}</p>
              </div>
            )}
          </div>

          <div style={{ fontSize: '10px', color: '#666', marginTop: '15px' }}>
            <h6>🔧 Información Técnica:</h6>
            <details>
              <summary>Ver JSON completo de respuesta</summary>
              <pre style={{ 
                backgroundColor: '#f1f1f1', 
                padding: '10px', 
                borderRadius: '3px',
                overflow: 'auto',
                maxHeight: '200px' 
              }}>
                {JSON.stringify(debugInfo?.slotsResponse, null, 2)}
              </pre>
            </details>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeSlotsDebug; 