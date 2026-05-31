# Proximos pasos por responsable

## Puedo hacerlo yo desde el codigo

- Mantener pasando `npm run qa:local`.
- Ajustar configuracion cuando tengas URL publica de backend.
- Conectar Supabase en la app cuando tengas URL y anon key.
- Probar registro/login/sync despues de que ejecutes el schema.
- Preparar build preview con EAS si ya estas logueado.
- Revisar y pulir textos de tienda, politica, terminos y aviso medico.
- Integrar RevenueCat/Stripe cuando existan cuentas, productos y claves.
- Hacer una pasada de bugs despues de pruebas en dispositivo real.

## Necesitas hacerlo tu

- Confirmar nombre final: `Zentra`.
- Confirmar bundle/package final: `com.zentra.app`.
- Mantener la URL publica del backend configurada en `.env` y EAS.
- Crear `OPENAI_API_KEY` real.
- Crear proyecto Supabase.
- Ejecutar `docs/SUPABASE_SCHEMA.sql` en Supabase.
- Pasar o cargar en `.env`:
  - `EXPO_PUBLIC_API_BASE_URL`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Crear cuenta Apple Developer.
- Crear cuenta Google Play Console.
- Crear cuenta RevenueCat.
- Crear productos de suscripcion en Apple/Google.
- Crear cuenta Stripe si vas a cobrar en web.
- Definir precio mensual/anual.
- Publicar politica de privacidad y terminos en URLs accesibles.
- Conseguir o aprobar screenshots finales.
- Probar en iPhone y Android reales.

## Orden recomendado

1. Confirmar identidad final.
2. Backend publico con OpenAI real.
3. Supabase real con login/sync.
4. Build preview iOS/Android.
5. QA en dispositivos reales.
6. Legal, assets y fichas de tienda.
7. Pagos PRO.
8. Build production y envio a tiendas.
