using UnityEngine;
public class AxeController : MonoBehaviour
{
    //public
    public bool activated;
    public float rotationSpeed= 180f;
    public float rotationValue;
    public GameObject player;
    void Update()
    {    
        if (activated)
        {            
            float distance = Vector3.Distance(transform.position, player.transform.position);
            if (distance <= 3.5f)//roate the axe to hand rotation so it wil be nicer when it snaps in the hand
            {
                Quaternion.Slerp(transform.rotation, Quaternion.Euler(90, 0, 0), 1);
            }
            else if (distance > 3.5f)//roatate the axe till its in range
            {
                rotationValue += rotationSpeed * Time.deltaTime;
                transform.rotation = Quaternion.Euler(4, rotationValue, rotationValue);
            }
        }
        else
		{
            GetComponent<Rigidbody>().Sleep();
            GetComponent<Rigidbody>().collisionDetectionMode = CollisionDetectionMode.ContinuousSpeculative;
            GetComponent<Rigidbody>().isKinematic = true;
        }
    }
    private void OnCollisionEnter(Collision collision)
    {
		if (collision.transform.tag != "Player")
        { 
            GetComponent<Rigidbody>().Sleep();
            GetComponent<Rigidbody>().collisionDetectionMode = CollisionDetectionMode.ContinuousSpeculative;
            GetComponent<Rigidbody>().isKinematic = true;
            activated = false;
		}
    }
}