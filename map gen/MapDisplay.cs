using System.Collections;
using UnityEngine;

public class MapDisplay : MonoBehaviour
{
    // public
    public MeshFilter meshFilther;
    public MeshRenderer meshRenderer;
    //private
    public void DrawMesh(MeshData meshData,Texture2D texture)
	{
        meshFilther.sharedMesh = meshData.CreateMesh();
        meshRenderer.sharedMaterial.mainTexture = texture;
    }
}