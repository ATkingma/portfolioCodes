using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public class MapGenerator : MonoBehaviour
{
    // public
    public Gradient gradient;
    [Range(0, 6)]
    public int editorPrevieuwLOD;
    public int ocataves;
    public int mapSeed;
    [Range(0, 1)]
    public float presitance;
    public float meshHeightMultiplier;
    public float lacunarity;
    public float noiseScale;
    public float[,] fallOffMap;
    public AnimationCurve meshHeightCurve;
    public Vector2 offset;
    public bool useFallOffs;
    public bool generateEnviroment;
    public bool flatShading;
    public GameObject terrainObject;


    //private
    private float minTerrainheight;
    private float maxTerrainheight;
    const int chuckSize = 241;

    private void Start()
    {
        if (mapSeed == 0) {
            mapSeed = Random.Range(0, 99999);
		}

        GenerateMap();
    }

	private void Update()
	{

        mapSeed = Random.Range(0, 99999);
        GenerateMap();
		
    }

	public void GenerateMap()
    {
        Random.InitState(mapSeed);//seed
        fallOffMap = FalloffGenerator.GenerateFalloffMap(chuckSize);
        float[,] noisemap = Noise.GenerateNoiseMap(chuckSize, chuckSize, mapSeed, noiseScale, ocataves, presitance, lacunarity, offset);

        Color[] collorMap = new Color[chuckSize * chuckSize];
        for (int y = 0; y < chuckSize; y++)
        {
            for (int x = 0; x < chuckSize; x++)
            {
                if (useFallOffs)
                {
                    if (fallOffMap == null)
                    {
                        fallOffMap = FalloffGenerator.GenerateFalloffMap(chuckSize);
                    }
                    noisemap[x, y] = Mathf.Clamp01(noisemap[x, y] - fallOffMap[x, y]);
                }
            }
        }

        MapDisplay display = FindObjectOfType<MapDisplay>();
        display.DrawMesh(MeshGenerator.GenerateTerrainMesh(noisemap, meshHeightMultiplier, meshHeightCurve, editorPrevieuwLOD, flatShading,GetComponent<MapGenerator>()), TextureGenerator.TextureFromColourMap(collorMap, chuckSize, chuckSize));

        ColorMap();
    }

    private void SetMinMaxHeights(float noiseHeight)
    {
        // Set min and max height of map for color gradient
        if (noiseHeight > maxTerrainheight)
            maxTerrainheight = noiseHeight;
        if (noiseHeight < minTerrainheight)
            minTerrainheight = noiseHeight;
    }

    public void ColorMap()
    {
		Mesh mesh = terrainObject.GetComponent<MeshFilter>().mesh;
        Vector3[] vertices = mesh.vertices;
        Color[] colors = new Color[vertices.Length];
        for (int i = 0; i < vertices.Length; i++)
        {
            SetMinMaxHeights(vertices[i].y);
            float height = Mathf.InverseLerp(minTerrainheight, maxTerrainheight, vertices[i].y);
            colors[i] = gradient.Evaluate(height);
            new WaitForSeconds(0.001f);
        }
        mesh.colors = colors;
    }
}