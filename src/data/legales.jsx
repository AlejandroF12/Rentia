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
      titulo: 'Sobre Rentia',
      texto: 'Rentia es el nombre de este proyecto académico y de su prototipo web y móvil. Este documento no identifica una sociedad comercial ni una persona natural como operador jurídico, y no publica un domicilio o canal externo de atención. El Centro de ayuda de la aplicación es informativo y no recibe reclamaciones formales. Usa datos de prueba y no ingreses información sensible.',
    },
    {
      id: 'servicio',
      titulo: 'Qué ofrece la plataforma',
      texto: 'Rentia es un prototipo académico en desarrollo que permite consultar publicaciones de maquinaria, equipos y vehículos, y facilitar el contacto entre clientes y arrendadores. No recibe reservas, no celebra ni administra contratos de arrendamiento, no cobra el precio del alquiler, no coordina la entrega y no ofrece seguros ni certifica la identidad, propiedad, estado, disponibilidad o aptitud del equipo. El contacto para consultar una publicación se inicia por WhatsApp o llamada y continúa fuera de Rentia. Las funciones se ofrecen como demostración y no eliminan las obligaciones que la ley atribuya a quienes operen el servicio.',
    },
    {
      id: 'cuenta',
      titulo: 'Registro, edad y seguridad de la cuenta',
      texto: 'El registro está habilitado para crear perfiles de cliente o arrendador; no se permite el autorregistro de cuentas administradoras. La demostración está dirigida a personas mayores de 18 años y solicita una declaración de mayoría de edad, sin pedir la fecha de nacimiento. Usa datos de prueba, proporciona información veraz, protege tus credenciales y avisa por los canales académicos del proyecto si sospechas que otra persona usa tu cuenta. No se permite suplantar identidades, crear cuentas para evadir restricciones ni utilizar la plataforma para fines ilícitos.',
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
      texto: 'El prototipo incluye estados de prueba para las suscripciones, pero no procesa cobros. El modelo académico contempla una prueba gratuita de 30 días y un plan de referencia de $125.000 COP por mes calendario. Wompi está integrado de forma preparatoria, pero el checkout permanece deshabilitado; no se envían datos de pago ni se inicia ningún cobro. La renovación automática también está desactivada. Cualquier uso comercial futuro requeriría completar la configuración del proveedor, informar condiciones definitivas y obtener las autorizaciones que correspondan. Los estados de suscripción que aparecen en la interfaz sirven para probar el acceso a funciones.',
    },
    {
      id: 'responsabilidad',
      titulo: 'Alcance y derechos obligatorios',
      texto: 'Cada usuario responde por la información y las actuaciones que controla. Rentia adopta medidas razonables para operar y moderar la plataforma, pero no puede asegurar que todo contenido de terceros sea exacto o que el servicio esté disponible sin interrupciones. Ninguna disposición de estos términos pretende excluir o limitar derechos irrenunciables, garantías, deberes de información, protección al consumidor, responsabilidad por dolo o culpa grave, ni cualquier obligación que la ley atribuya a Rentia.',
    },
    {
      id: 'cambios',
      titulo: 'Cambios, reclamaciones y ley aplicable',
      texto: 'Los cambios sustanciales de estos textos se publicarán con su fecha. Rentia identifica el proyecto académico, pero esta versión no dispone de un canal externo formal para consultas, reclamaciones o ejercicio de derechos; el Centro de ayuda solo ofrece orientación. No uses la demostración para enviar información personal real. Este texto no sustituye una revisión jurídica ni limita los derechos u obligaciones que establezca la ley colombiana.',
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
      texto: 'Rentia es el nombre del proyecto académico y del prototipo que trata los datos descritos en esta política; este documento no identifica una sociedad comercial ni una persona natural como responsable jurídico. No hay un domicilio ni un correo o teléfono formal para solicitudes. El Centro de ayuda es informativo y no recibe reclamaciones formales. Esta aclaración no reemplaza la identificación del responsable que sería necesaria para operar el servicio fuera de la demostración.',
    },
    {
      id: 'alcance',
      titulo: 'A quién y a qué aplica',
      texto: 'Esta política describe el tratamiento de datos relacionado con Rentia, su sitio web y su aplicación académica. Se dirige a clientes, arrendadores y personas que consultan o reportan contenido. El registro está habilitado para perfiles de cliente y arrendador, y solicita declarar que se tienen 18 años o más, sin pedir la fecha de nacimiento. No se solicitan datos sensibles como requisito; evita incluirlos en publicaciones, reportes o mensajes y usa únicamente datos de prueba.',
    },
    {
      id: 'datos',
      titulo: 'Datos que se recogen',
      texto: 'Según las funciones usadas, Rentia trata nombre, correo electrónico, teléfono, rol, municipio, datos de perfil y, si la persona la carga, su foto de perfil; identificadores de cuenta y credenciales gestionados por Supabase Auth; publicaciones de equipos (nombre, categoría, marca, modelo, descripción, municipio, sector y coordenadas), fotografías y disponibilidad; favoritos; valoraciones; reportes y sus estados; apelaciones, incluyendo sus motivos y respuestas; y estados de prueba de suscripción. El checkout de Wompi está deshabilitado, por lo que Rentia no envía datos de pago ni procesa datos de tarjetas. También se conserva la autorización del arrendador para compartir su contacto. La ubicación precisa del dispositivo se obtiene solo tras una acción voluntaria: se usa temporalmente para filtrar el catálogo o, si la persona la selecciona en una publicación, para guardar coordenadas asociadas al equipo.',
    },
    {
      id: 'finalidades',
      titulo: 'Finalidades y autorizaciones',
      texto: 'Los datos se usan para crear y proteger cuentas; permitir el acceso y las preferencias de sesión; mostrar perfiles y equipos; guardar favoritos; calcular filtros de cercanía en el dispositivo; facilitar el contacto autorizado; administrar publicaciones, valoraciones, reportes y apelaciones; moderar el servicio; atender consultas y reclamaciones; prevenir fraude o abuso; y cumplir deberes legales. Se solicitará autorización previa, expresa e informada para los tratamientos que la requieran. El consentimiento para compartir el teléfono del arrendador y cualquier autorización para comunicaciones comerciales se pedirán por separado; Rentia no debe asumir que aceptar esta política equivale a consentir publicidad.',
    },
    {
      id: 'visibilidad',
      titulo: 'Información visible para otras personas',
      texto: 'Las fichas publicadas y sus fotografías se alojan en un espacio de almacenamiento con acceso público y pueden ser vistas, copiadas o indexadas por terceros. La ficha puede incluir la descripción, municipio, sector y coordenadas seleccionadas para el equipo. La foto de perfil es opcional, se guarda en almacenamiento privado y se muestra en perfiles públicos y valoraciones mediante enlaces temporales; cualquier persona que obtenga uno de esos enlaces puede abrir la imagen mientras siga vigente. El nombre y teléfono del arrendador se muestran a usuarios con sesión iniciada únicamente cuando existe autorización de contacto; el correo no se muestra en el catálogo. Las valoraciones publicadas y ciertos datos básicos de perfil pueden ser visibles según las funciones del sitio. No publiques domicilios, documentos, rostros u otros datos personales que no quieras hacer públicos.',
    },
    {
      id: 'ubicacion',
      titulo: 'GPS, mapas y servicios externos',
      texto: 'Rentia no sigue continuamente a personas ni vehículos. El GPS se consulta solo al pulsar una función que lo necesita y se sujeta al permiso del navegador o del dispositivo. En el catálogo, las coordenadas se mantienen en el estado de la aplicación para calcular distancias; no se envían a Rentia para ese filtro. Si se usan para ubicar un equipo, las coordenadas elegidas se guardan en la publicación. Los mapas y la búsqueda de municipios usan OpenStreetMap y Nominatim; al cargar sus recursos, esos proveedores pueden recibir datos técnicos de la conexión y las consultas de ubicación. Revisa sus propias políticas antes de usarlos.',
    },
    {
      id: 'encargados',
      titulo: 'Proveedores y transferencias',
      texto: 'La aplicación usa Supabase para autenticación, base de datos y almacenamiento de fotografías, y Vercel para alojar el sitio. Los mapas y la geocodificación consultan servicios de OpenStreetMap/Nominatim. Si se habilitan suscripciones, Wompi procesará los pagos y los datos que requiera para completar la transacción; Rentia conservará referencias, valores y estados de pago, pero no los datos de tarjeta. Si eliges llamar o abrir WhatsApp, la comunicación sale de Rentia y queda sujeta al proveedor correspondiente; Rentia no lee esas conversaciones. Los proveedores, ubicación de servidores, condiciones contractuales y eventuales transmisiones internacionales deben verificarse y documentarse por el responsable antes de habilitar el servicio. No se identifican en el código consultado herramientas de analítica o publicidad de terceros.',
    },
    {
      id: 'almacenamiento',
      titulo: 'Almacenamiento, seguridad y conservación',
      texto: 'Los tokens de sesión se guardan en el almacenamiento local o de sesión del navegador, según la preferencia de acceso. La preferencia de interfaz también puede guardarse localmente. Rentia usa controles de acceso configurados para la demostración, pero el prototipo no representa una certificación de seguridad. No hay un plazo automatizado de conservación para cada categoría: los datos de prueba pueden permanecer en Supabase hasta que se eliminen manualmente o se retire el entorno; las copias de respaldo pueden depender de los plazos del proveedor. No ingreses información sensible ni datos personales que no sean necesarios para probar los flujos.',
    },
    {
      id: 'derechos',
      titulo: 'Derechos de las personas titulares',
      texto: 'De acuerdo con la Ley 1581 de 2012, puedes conocer, actualizar y rectificar tus datos; solicitar prueba de la autorización cuando sea exigible; preguntar por el uso dado a la información; presentar consultas o reclamos; pedir la revocatoria de la autorización o la supresión cuando legalmente proceda; y acceder gratuitamente a tus datos. La revocatoria o supresión puede no proceder mientras exista un deber legal o contractual de conservar información. También puedes acudir a la Superintendencia de Industria y Comercio una vez agotado el trámite previo ante el responsable, cuando ese requisito sea aplicable.',
    },
    {
      id: 'solicitudes',
      titulo: 'Cómo presentar una consulta o reclamo',
      texto: 'El prototipo no tiene un canal formal integrado para recibir consultas o reclamos sobre datos personales. El Centro de ayuda es informativo y no envía solicitudes. Para el trabajo académico, utiliza el canal de comunicación que haya dispuesto el curso o el equipo del proyecto; no envíes contraseñas ni datos sensibles. Esta limitación de la demo no sustituye los canales y plazos que serían necesarios para una operación real.',
    },
    {
      id: 'menores',
      titulo: 'Niñas, niños y adolescentes',
      texto: 'La demostración no está diseñada para cuentas de menores. El formulario solicita declarar que se tienen 18 años o más y no pide la fecha de nacimiento. No uses datos de menores en cuentas, publicaciones ni reportes.',
    },
    {
      id: 'vigencia',
      titulo: 'Vigencia y cambios de esta política',
      texto: 'Esta es una versión informativa del proyecto académico Rentia, actualizada el 12 de noviembre de 2026. No constituye asesoría ni revisión jurídica y no describe un servicio comercial. Si Rentia se prepara para operar fuera del contexto académico, será necesario actualizar esta política, identificar al responsable, establecer canales de atención y revisar los tratamientos y autorizaciones antes de esa operación.',
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
      texto: 'Quien publica responde por los datos y derechos sobre el contenido que aporta. Las medidas de moderación no sustituyen los derechos que otorgue la ley. Rentia es el nombre del proyecto académico y esta demostración no dispone de canales externos formales para reclamaciones; consulta el Centro de ayuda para orientación y no publiques información privada.',
    },
  ],
};
