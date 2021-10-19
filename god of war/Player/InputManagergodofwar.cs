using UnityEngine;
public class InputManagergodofwar : MonoBehaviour
{
    //public
    public bool forwardPressed, backwardsPressed, leftPressed, rightPressed, runPressed, leftClick, rightClick,taunt,equip,spacebar;
    void Update()
    {
        //input 
        forwardPressed = Input.GetKey("w");
        backwardsPressed = Input.GetKey("s");
        leftPressed = Input.GetKey("a");
        rightPressed = Input.GetKey("d");
        spacebar = Input.GetKey("space");
        runPressed = Input.GetKey("left shift");
        equip = Input.GetKeyDown("f");
        taunt = Input.GetKeyDown("t");
        leftClick = Input.GetKeyDown(KeyCode.Mouse0);
        rightClick = Input.GetKey(KeyCode.Mouse1);
    }
}