const referenciasColombia = [
  {
    titulo: 'Ley 1581 de 2012 — protección de datos personales',
    url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981',
  },
  {
    titulo: 'Decreto 1074 de 2015 — reglamentación del sector Comercio',
    url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=76608',
  },
  {
    titulo: 'Ley 1480 de 2011 — Estatuto del Consumidor',
    url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=44306',
  },
];

export const terminos = {
  titulo: 'Términos y condiciones de uso',
  subtitulo: 'Reglas para utilizar Rentia y relacionarse con otras personas usuarias.',
  referencias: referenciasColombia,
  secciones: [
    {
      id: 'identificacion',
      titulo: 'Quién presta Rentia',
      texto: 'Responsable y operador de la plataforma: Por definir (nombre o razón social y, si aplica, NIT). Domicilio para notificaciones: Por definir. Correo y teléfono de atención: Por definir. Estos datos deben completarse antes de habilitar el registro o presentar este documento como versión definitiva.',
    },
    {
      id: 'servicio',
      titulo: 'Qué ofrece la plataforma',
      texto: 'Rentia es una plataforma digital en desarrollo que permite consultar publicaciones de maquinaria, equipos y vehículos, y facilitar el contacto entre clientes y arrendadores. Actualmente no recibe reservas, no celebra ni administra los contratos de arrendamiento, no cobra el precio del alquiler, no coordina la entrega y no ofrece seguros ni certifica la identidad, propiedad, estado, disponibilidad o aptitud del equipo. El contacto para consultar una publicación se inicia por WhatsApp o llamada y continúa fuera de Rentia. Estas características no eliminan las obligaciones que la ley imponga a Rentia por sus propios servicios.',
    },
    {
      id: 'cuenta',
      titulo: 'Registro, edad y seguridad de la cuenta',
      texto: 'El registro público se encuentra temporalmente pausado. Cuando se habilite, la cuenta estará dirigida a personas mayores de 18 años y se solicitará una declaración de mayoría de edad; no se prevé pedir ni almacenar la fecha de nacimiento. Cada persona deberá entregar información veraz, mantenerla actualizada, proteger sus credenciales y avisar si sospecha que otra persona usa su cuenta. No se permite suplantar identidades, crear cuentas para evadir restricciones ni utilizar la plataforma para fines ilícitos.',
    },
    {
      id: 'arrendadores',
      titulo: 'Publicaciones de arrendadores',
      texto: 'Quien publique declara tener autorización para ofrecer el equipo y para compartir la información, fotografías y datos incorporados en la ficha. Debe describir el equipo con exactitud, mantener actualizada su disponibilidad y no publicar contenido engañoso, ajeno o ilícito. El arrendador es responsable de definir y comunicar directamente precio, condiciones, requisitos, operador, transporte, permisos, seguridad y demás aspectos de su oferta, sin perjuicio de las responsabilidades que establezca la ley.',
    },
    {
      id: 'clientes',
      titulo: 'Consultas y acuerdos entre las partes',
      texto: 'La disponibilidad visible es informativa y no constituye una reserva. Antes de acordar o pagar un alquiler, cada parte debe verificar la identidad de su contraparte, la autoridad para disponer del equipo, su estado, condiciones de uso, precio, entrega, seguros y documentos que correspondan. Los acuerdos se realizan directamente entre las partes. Rentia no garantiza que se concrete una operación ni que una publicación permanezca disponible; conserva las responsabilidades legales que sí le correspondan.',
    },
    {
      id: 'ubicacion',
      titulo: 'Ubicación y uso del GPS',
      texto: 'El permiso de ubicación del dispositivo se solicita cuando la persona pulsa una función que lo necesita. En el catálogo, la ubicación se usa en el dispositivo para filtrar equipos por distancia; no se guarda allí como una ruta ni como seguimiento continuo. Al crear o editar una publicación, las coordenadas elegidas en el mapa —que pueden obtenerse del GPS— se guardan asociadas al equipo y pueden mostrarse en su ficha. Antes de publicar, el arrendador debe fijar un punto de referencia que no revele innecesariamente su domicilio u otra ubicación privada.',
    },
    {
      id: 'contacto',
      titulo: 'Autorización para mostrar datos de contacto',
      texto: 'El nombre y teléfono de un arrendador solo se comparten para consultas sobre sus equipos cuando existe autorización para publicar esos datos y el usuario que consulta inició sesión. El correo electrónico no se publica en el catálogo. La autorización para compartir el teléfono es distinta de la aceptación de estos términos y del aviso de privacidad; puede retirarse en los controles disponibles del perfil. Al retirar la autorización o dejar de publicar, el contacto deja de ofrecerse desde las fichas, sin que ello elimine copias o comunicaciones que otras personas ya hayan obtenido.',
    },
    {
      id: 'contenido',
      titulo: 'Contenido, valoraciones y reportes',
      texto: 'Quien aporta textos, fotografías, valoraciones u otro contenido debe tener derechos y permisos para hacerlo, y concede a Rentia únicamente el permiso necesario para alojarlo, reproducirlo y mostrarlo dentro del servicio mientras se encuentre publicado. Las valoraciones deben ser respetuosas y basarse en una interacción directa; no prueban por sí solas que haya ocurrido un arrendamiento. Los reportes se revisan de forma privada y no producen una sanción automática. Rentia puede ocultar o retirar contenido contrario a la ley o a estas reglas, explicando la decisión cuando corresponda.',
    },
    {
      id: 'moderacion',
      titulo: 'Moderación, suspensión y apelación',
      texto: 'Ante una infracción o un riesgo para la comunidad, Rentia puede solicitar correcciones, ocultar una publicación o suspender una cuenta. La medida debe guardar relación con el caso y comunicarse con su motivo, salvo que una obligación legal o una situación urgente exija actuar de otra forma. Las personas usuarias pueden utilizar la función de apelación disponible para cuentas suspendidas. La eliminación de una cuenta o contenido no suprime obligaciones de conservación impuestas por la ley ni registros necesarios para resolver una reclamación.',
    },
    {
      id: 'suscripcion',
      titulo: 'Suscripciones futuras para arrendadores',
      texto: 'Rentia todavía no ofrece ni cobra suscripciones. El modelo previsto contempla un mes de prueba para arrendadores y que, al terminar sin activarse el pago, las publicaciones y el contacto comercial permanezcan ocultos hasta contratar un plan. Antes de habilitar esa función se informarán, en condiciones separadas, el precio, moneda, periodicidad, inicio y fin de la prueba, prestaciones, renovación, forma de pago, cancelación, tratamiento de pagos y reglas de reembolso. No se iniciará un cobro ni una conversión automática a un plan pago sin información previa y autorización expresa. Este borrador no activa una prueba ni constituye una orden de pago.',
    },
    {
      id: 'responsabilidad',
      titulo: 'Alcance y derechos obligatorios',
      texto: 'Cada usuario responde por la información y las actuaciones que controla. Rentia adopta medidas razonables para operar y moderar la plataforma, pero no puede asegurar que todo contenido de terceros sea exacto o que el servicio esté disponible sin interrupciones. Ninguna disposición de estos términos pretende excluir o limitar derechos irrenunciables, garantías, deberes de información, protección al consumidor, responsabilidad por dolo o culpa grave, ni cualquier obligación que la ley atribuya a Rentia.',
    },
    {
      id: 'cambios',
      titulo: 'Cambios, reclamaciones y ley aplicable',
      texto: 'Los cambios sustanciales se publicarán con su fecha de actualización y, cuando corresponda, se solicitará una nueva aceptación antes de continuar usando la función afectada. Para consultas, reclamaciones o ejercicio de derechos, el responsable, domicilio y canales de atención están Por definir; esta información debe completarse antes de abrir el registro. Se aplican las leyes de Colombia y las autoridades competentes, incluidos los mecanismos de protección al consumidor que resulten aplicables.',
    },
  ],
};

export const privacidad = {
  titulo: 'Política de privacidad y tratamiento de datos',
  subtitulo: 'Información sobre los datos que Rentia trata, los usos y los derechos de sus titulares.',
  referencias: referenciasColombia,
  secciones: [
    {
      id: 'responsable',
      titulo: 'Responsable del tratamiento',
      texto: 'Responsable: Por definir (nombre completo de la persona natural o razón social y NIT, si aplica). Domicilio: Por definir. Correo electrónico y teléfono para consultas y reclamos de datos: Por definir. La identidad y los canales reales del responsable deben publicarse antes de reabrir el registro; el Centro de ayuda de esta versión no recibe solicitudes por sí mismo.',
    },
    {
      id: 'alcance',
      titulo: 'A quién y a qué aplica',
      texto: 'Esta política describe el tratamiento de datos personales relacionado con Rentia, su sitio web y su aplicación. Se dirige a clientes, arrendadores y personas que consultan o reportan contenido. El registro está temporalmente pausado. Cuando se habilite, se proyecta admitir personas mayores de 18 años mediante una declaración de edad, sin solicitar su fecha de nacimiento. No se solicitan datos sensibles como requisito de registro; evita incluirlos en publicaciones, reportes o mensajes.',
    },
    {
      id: 'datos',
      titulo: 'Datos que se recogen',
      texto: 'Según las funciones usadas, Rentia trata nombre, correo electrónico, teléfono, rol, municipio y datos de perfil; identificadores de cuenta y credenciales gestionados por el servicio de autenticación; publicaciones de equipos (nombre, categoría, marca, modelo, descripción, municipio, sector y coordenadas), fotografías y disponibilidad; favoritos; valoraciones; reportes y sus estados; y apelaciones, incluyendo sus motivos y respuestas. También se conserva la autorización del arrendador para compartir su contacto. La ubicación precisa del dispositivo se obtiene solo tras una acción voluntaria: se usa temporalmente para filtrar el catálogo o, si la persona la selecciona en una publicación, para guardar coordenadas asociadas al equipo.',
    },
    {
      id: 'finalidades',
      titulo: 'Finalidades y autorizaciones',
      texto: 'Los datos se usan para crear y proteger cuentas; permitir el acceso y las preferencias de sesión; mostrar perfiles y equipos; guardar favoritos; calcular filtros de cercanía en el dispositivo; facilitar el contacto autorizado; administrar publicaciones, valoraciones, reportes y apelaciones; moderar el servicio; atender consultas y reclamaciones; prevenir fraude o abuso; y cumplir deberes legales. Se solicitará autorización previa, expresa e informada para los tratamientos que la requieran. El consentimiento para compartir el teléfono del arrendador y cualquier autorización para comunicaciones comerciales se pedirán por separado; Rentia no debe asumir que aceptar esta política equivale a consentir publicidad.',
    },
    {
      id: 'visibilidad',
      titulo: 'Información visible para otras personas',
      texto: 'Las fichas publicadas y sus fotografías se alojan en un espacio de almacenamiento con acceso público y pueden ser vistas, copiadas o indexadas por terceros. La ficha puede incluir la descripción, municipio, sector y coordenadas seleccionadas para el equipo. El nombre y teléfono del arrendador se muestran a usuarios con sesión iniciada únicamente cuando existe autorización de contacto; el correo no se muestra en el catálogo. Las valoraciones publicadas y ciertos datos básicos de perfil pueden ser visibles según las funciones del sitio. No publiques domicilios, documentos, rostros u otros datos personales que no quieras hacer públicos.',
    },
    {
      id: 'ubicacion',
      titulo: 'GPS, mapas y servicios externos',
      texto: 'Rentia no sigue continuamente a personas ni vehículos. El GPS se consulta solo al pulsar una función que lo necesita y se sujeta al permiso del navegador o del dispositivo. En el catálogo, las coordenadas se mantienen en el estado de la aplicación para calcular distancias; no se envían a Rentia para ese filtro. Si se usan para ubicar un equipo, las coordenadas elegidas se guardan en la publicación. Los mapas y la búsqueda de municipios usan OpenStreetMap y Nominatim; al cargar sus recursos, esos proveedores pueden recibir datos técnicos de la conexión y las consultas de ubicación. Revisa sus propias políticas antes de usarlos.',
    },
    {
      id: 'encargados',
      titulo: 'Proveedores y transferencias',
      texto: 'La aplicación usa Supabase para autenticación, base de datos y almacenamiento de fotografías, y Vercel para alojar el sitio. Los mapas y la geocodificación consultan servicios de OpenStreetMap/Nominatim. Si eliges llamar o abrir WhatsApp, la comunicación sale de Rentia y queda sujeta al proveedor correspondiente; Rentia no lee esas conversaciones. Los proveedores, ubicación de servidores, condiciones contractuales y eventuales transmisiones internacionales deben verificarse y documentarse por el responsable antes de habilitar el servicio. No se identifican en el código consultado herramientas de analítica o publicidad de terceros.',
    },
    {
      id: 'almacenamiento',
      titulo: 'Almacenamiento, seguridad y conservación',
      texto: 'Los tokens de sesión se guardan en el almacenamiento local o de sesión del navegador, según la preferencia de acceso. La preferencia de interfaz también puede guardarse localmente. Rentia y sus proveedores deben aplicar controles técnicos y organizativos razonables para evitar acceso, pérdida, alteración o uso no autorizado. No existe aún un plazo de conservación definido para cada categoría; debe fijarse antes de reabrir el registro. Como criterio, se conservarán los datos solo por el tiempo necesario para las finalidades informadas y los plazos u obligaciones legales, y después se eliminarán o anonimizarán cuando proceda.',
    },
    {
      id: 'derechos',
      titulo: 'Derechos de las personas titulares',
      texto: 'De acuerdo con la Ley 1581 de 2012, puedes conocer, actualizar y rectificar tus datos; solicitar prueba de la autorización cuando sea exigible; preguntar por el uso dado a la información; presentar consultas o reclamos; pedir la revocatoria de la autorización o la supresión cuando legalmente proceda; y acceder gratuitamente a tus datos. La revocatoria o supresión puede no proceder mientras exista un deber legal o contractual de conservar información. También puedes acudir a la Superintendencia de Industria y Comercio una vez agotado el trámite previo ante el responsable, cuando ese requisito sea aplicable.',
    },
    {
      id: 'solicitudes',
      titulo: 'Cómo presentar una consulta o reclamo',
      texto: 'Dirige la solicitud al responsable identificado en la primera sección e incluye tu nombre, medio de respuesta, descripción clara de lo solicitado y la información necesaria para localizar los datos. No envíes contraseñas ni datos sensibles innecesarios. El correo, domicilio y formulario para recibir estas solicitudes están Por definir; hoy no hay un canal externo configurado y el Centro de ayuda es únicamente informativo. Una vez habilitado el canal, las consultas se atenderán dentro del término legal de diez (10) días hábiles, prorrogable hasta por cinco (5) días hábiles adicionales con explicación. Los reclamos completos se atenderán dentro de quince (15) días hábiles desde el día siguiente a su recepción, prorrogables hasta por ocho (8) días hábiles adicionales con explicación; si faltan datos, se aplican las reglas legales para requerir que se complete la solicitud.',
    },
    {
      id: 'menores',
      titulo: 'Niñas, niños y adolescentes',
      texto: 'El servicio no está diseñado para cuentas de menores. Cuando se habilite el registro se solicitará declarar que se es mayor de 18 años, sin pedir la fecha de nacimiento. Si Rentia conoce que se han registrado datos de un menor, evaluará el caso conforme a la ley y al interés superior del menor y tomará las medidas que correspondan.',
    },
    {
      id: 'vigencia',
      titulo: 'Vigencia y cambios de esta política',
      texto: 'Esta versión es un borrador de trabajo fechado el 11 de noviembre de 2026 y no sustituye la revisión jurídica ni completa los datos del responsable, canales, plazos internos o proveedores. Se informarán cambios relevantes en esta página y, si un nuevo uso requiere autorización, esta se solicitará antes de aplicarlo. No debe reabrirse el registro mientras los campos Por definir y el mecanismo para dejar constancia de la autorización sigan pendientes.',
    },
  ],
};

export const normas = {
  titulo: 'Normas de publicación y comunidad',
  subtitulo: 'Reglas para publicar equipos, contactar y participar con respeto.',
  referencias: referenciasColombia,
  secciones: [
    {
      id: 'reales',
      titulo: 'Publica equipos que puedas ofrecer',
      texto: 'Cada publicación debe corresponder a un equipo real que puedas ofrecer o para el cual tengas autorización. Elige la categoría correcta e informa con claridad sus características, estado, limitaciones y disponibilidad. No suplantes a propietarios ni dupliques anuncios para confundir a quienes consultan.',
    },
    {
      id: 'fotografias',
      titulo: 'Usa imágenes autorizadas',
      texto: 'Publica únicamente fotografías propias o sobre las que tengas permiso suficiente. Deben representar el equipo y su estado actuales. No uses imágenes ajenas como si fueran propias ni incluyas documentos, placas, rostros, domicilios u otros datos personales de terceros sin autorización. Al cargar una imagen, autorizas su alojamiento y visualización dentro de la publicación.',
    },
    {
      id: 'informacion',
      titulo: 'Información y ubicación honestas',
      texto: 'No exageres prestaciones ni ocultes limitaciones relevantes. Mantén actualizada la ficha y su disponibilidad. La ubicación puede incluir coordenadas elegidas en el mapa o tomadas del GPS; antes de guardar, comprueba el punto y evita exponer una residencia o ubicación privada. El permiso GPS se solicita solo cuando usas esa función.',
    },
    {
      id: 'contacto',
      titulo: 'Contacto autorizado y seguro',
      texto: 'El arrendador solo debe autorizar la publicación de su teléfono si desea recibir consultas por WhatsApp o llamada. No uses ese contacto para acoso, amenazas, publicidad no solicitada o fines ajenos a la consulta del equipo. El precio, condiciones, entrega, documentación y seguridad deben confirmarse directamente entre las partes.',
    },
    {
      id: 'respeto',
      titulo: 'Respeto y valoraciones',
      texto: 'No se admiten amenazas, discriminación, acoso, suplantación ni contenido contrario a la ley. Las valoraciones deben describir una interacción real, con lenguaje respetuoso y sin revelar datos privados de otras personas. Una valoración no certifica que haya ocurrido un alquiler.',
    },
    {
      id: 'reportar',
      titulo: 'Reportes y revisión',
      texto: 'Puedes reportar una publicación o valoración desde las funciones disponibles, señalando el motivo y aportando solo la información necesaria. El reporte se trata de forma privada y no retira contenido automáticamente. Rentia puede pedir aclaraciones, moderar o retirar contenido y suspender cuentas cuando corresponda; procurará comunicar el motivo y existe una opción de apelación para cuentas suspendidas.',
    },
    {
      id: 'responsabilidad',
      titulo: 'Incumplimientos',
      texto: 'Quien publica responde por los datos y derechos sobre el contenido que aporta. Las medidas de moderación no sustituyen los derechos que otorgue la ley ni impiden presentar una reclamación por los canales que Rentia habilite. El responsable y los canales de contacto de Rentia están Por definir y deben completarse antes de reabrir el registro.',
    },
  ],
};
