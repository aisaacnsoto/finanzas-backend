export const WhatsAppTemplate = {

    TEMPLATE_REGISTRO_PRESUPUESTO:
        '📝¡Presupuesto creado, {{user}}!\n'
        + '✅Categoría: *{{categoria}}*\n'
        + '✅Monto estimado: *{{monto}}*\n'
        + '✅Mes: *{{mes}}*',

    TEMPLATE_REGISTRO_TRANSACCION:
        '📝¡{{tipo_transaccion}} anotado, {{user}}!\n'
        + '✅Categoría: *{{category}}*\n'
        + '✅Monto: *{{monto}}*\n'
        + '✅Descripción: {{descripcion}}\n'
        + '✅Cuenta: *{{account}}*',

    TEMPLATE_REGISTRO_CATEGORIA:
        '📝¡Categoría creada, {{user}}!\n'
        + '✅Nombre: *{{account}}*\n'
        + '✅Tipo: *{{tipo}}*',

    TEMPLATE_REGISTRO_CUENTA:
        '📝¡Cuenta creada, {{user}}!\n'
        + '✅Nombre: *{{account}}*',
}