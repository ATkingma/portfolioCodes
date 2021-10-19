using UnityEngine;
public class PlayerMovement : MonoBehaviour
{
    ///public
    public float speed=1f;
    public float runningSpeed = 2f;
    public float downForce;
    public Camera cam;
    public CharacterController controller;
    public InputManagergodofwar im;
    ///private
    private Vector3 moveDir;
    void Update()
    {
        InPut();
    }
    void InPut()
    {
        moveDir = new Vector3(Input.GetAxisRaw("Horizontal"), 0, Input.GetAxisRaw("Vertical"));
        //get cam pos
        transform.forward = new Vector3(cam.transform.forward.x, transform.forward.y, cam.transform.forward.z);
        moveDir = transform.TransformDirection(moveDir);
        //more input
        if (!im.runPressed)
        {
            controller.Move(moveDir.normalized * speed * Time.deltaTime);
            controller.Move(new Vector3(0, downForce, 0) * speed * Time.deltaTime);
        }
        if (im.rightPressed | im.leftPressed)
        {
            controller.Move(moveDir.normalized * speed * Time.deltaTime);
            controller.Move(new Vector3(0, downForce, 0) * speed * Time.deltaTime);
        }
        else if (im.runPressed&&!im.leftPressed&&!im.rightPressed)
        {
            controller.Move(moveDir.normalized * runningSpeed * Time.deltaTime);
            controller.Move(new Vector3(0, downForce, 0) * runningSpeed * Time.deltaTime);
        }      
    }
}