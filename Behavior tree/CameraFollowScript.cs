using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraFollowScript : MonoBehaviour
{
    public Transform target;
    // Update is called once per frame
    void Update()
    {
        if (target != null)
        { 
            this.transform.position = new Vector3(transform.position.x, transform.position.y, target.position.z);
		}
    }
}