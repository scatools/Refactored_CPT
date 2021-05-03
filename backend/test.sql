WITH mvtgeom as
    ( SELECT ST_AsMVTGeom ( ST_Transform(geom, 3857), ST_TileEnvelope(6,15,27) ) as geom
     FROM data_all,

         (SELECT ST_SRID(geom) AS srid
          FROM data_all
          LIMIT 1) a
     WHERE ST_Intersects( geom, ST_Transform( ST_TileEnvelope(6,15,27), srid ) ) )
SELECT ST_AsMVT(mvtgeom.*, 'data_all', 4096, 'geom') AS mvt FROM mvtgeom;