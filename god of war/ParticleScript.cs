using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ParticleScript : MonoBehaviour
{
    // public
    public float timeToDes;
    void Start()
    {
        Invoke("ObjectDes", timeToDes);
    }
    public void ObjectDes()
    {
        transform.SetParent(null);
        gameObject.GetComponent<ParticleSystem>().Stop();
    }
}