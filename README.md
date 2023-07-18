# Cobertura del servicio de internet de Entel

El presente repositorio muestra el proceso de preparación y transformación de datos cuya fuente en pdf contiene las tecnologías a nivel nacional del servicio de internet de Entel.  

La data se obtuvo del [siguiente enlace ](https://www.entel.pe/wp-content/uploads/2022/11/listado-ccpp-con-cobertura-movil-3Q2022.pdf) y corresponde a noviembre del 2022. Este documento en pdf debe ser descargado, preparado en csv y luego transformado a json para poder visualizarlo en un mapa.

## Preparación
La data que está en formato pdf debe convertirse a **csv** para poder manipularlo. Los pasos para la conversión son:

a. Abrir el pdf en word

b. Cambiar todos los "X" por "si" y las "/" por ";".

c. Copiar la tabla y llevarla a excel.

d. Manualmente arreglar algunas inconsistencias que se presentan al desactivar la union de celdas. 

e. Guardar el resultado como csv en la carpeta **"data/entel_movil_parsed.csv"**

## Transformación
Los datos preparados no resultan convenientes para la visualización. Antes es necesario convertirlo de pivot a long format usando el siguiente script en python [parser_internet_coverage.ipynb](https://github.com/ccalobeto/cobertura_internet/blob/master/parser_internet_coverage.ipynb). 

### Ejemplo de la transformación
<img src="images/pivot_to_longer_format.jpeg" width="480" height="300">

La salida de este script en python es el archivo json ubicado en **data/entel_movil_parsed.json**

## Inclusión de la cartografía de Perú
La metodología para la construcción de los límites geográficos a nivel de distrito, provincia y departamento se encuentra en [pe-atlas](https://github.com/ccalobeto/pe-atlas)
