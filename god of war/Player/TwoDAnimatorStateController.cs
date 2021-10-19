using UnityEngine;
public class TwoDAnimatorStateController : MonoBehaviour
{
    //public
    public InputManagergodofwar im;
    public Animator anim;
    public float acceleration=2f;
    public float decelaration = 2f;
    public float maxWalkVelocity=0.5f;
    public float maxRunVelocity = 2.0f;
    //private
    private float velocitiyZ = 0.0f;
    private float velocitiyX = 0.0f;
    void Update()
    {
        //updateinputbools
        bool forwardPressed = im.forwardPressed;
        bool backwardsPressed = im.backwardsPressed;
        bool leftPressed = im.leftPressed;
        bool rightPressed = im.rightPressed;
        bool runPressed = im.runPressed;

        //set current
        float currentMaxVelocity = runPressed ? maxRunVelocity : maxWalkVelocity;
        //velocity on input
        if (forwardPressed&&velocitiyZ< currentMaxVelocity )
        {
            velocitiyZ += Time.deltaTime * acceleration;
        }
        if (backwardsPressed && velocitiyZ > -currentMaxVelocity)
        {
            velocitiyZ -= Time.deltaTime * acceleration;
        }
        if (leftPressed && velocitiyX > -currentMaxVelocity)
        {
            velocitiyX -= Time.deltaTime * acceleration;
        }
        if (rightPressed && velocitiyX < currentMaxVelocity)
        {
            velocitiyX += Time.deltaTime * acceleration;
        }
        //decalertation
        if (!forwardPressed && velocitiyZ > 0.0f)//demin
        {
            velocitiyZ -= Time.deltaTime * decelaration;
        }
        if (!backwardsPressed && velocitiyZ < 0.0f)//demin
        {
            velocitiyZ += Time.deltaTime * decelaration;
        }
        if (!leftPressed && velocitiyX < 0.0f)//demin
        {
            velocitiyX += Time.deltaTime * decelaration;
        }
        if (!rightPressed && velocitiyX > 0.0f)//deplus
        {
            velocitiyX -= Time.deltaTime * decelaration;
        }
        if(!leftPressed&&!rightPressed&&velocitiyX != 0.0f && (velocitiyX > -0.5f && velocitiyX < 0.5f))
        {
            velocitiyX = 0;
        }
        //lock
        if (forwardPressed && runPressed && velocitiyZ > currentMaxVelocity)
        {
            velocitiyZ = currentMaxVelocity;
        }
        else if (forwardPressed && velocitiyZ > currentMaxVelocity)
        {
            velocitiyZ -= Time.deltaTime * decelaration;    
            if(velocitiyZ>currentMaxVelocity&& velocitiyZ > (currentMaxVelocity - 0.05f))
            {
                velocitiyZ = currentMaxVelocity;
            }
        }
        else if (forwardPressed && velocitiyZ < currentMaxVelocity && velocitiyZ > (currentMaxVelocity - 0.05f))
            {
            velocitiyZ = currentMaxVelocity;
            }

        //animator gets velocity
        anim.SetFloat("Velocity z", velocitiyZ);
        anim.SetFloat("Velocity x", velocitiyX);
    }
}