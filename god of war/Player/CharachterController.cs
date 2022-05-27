using UnityEngine;
using DG.Tweening;
using System.Collections;
using Cinemachine;

public class CharachterController : MonoBehaviour
{
    //public
    public InputManagergodofwar im;
    public PlayerMovement pm;
    public CinemachineImpulseSource inpulseSource;
    public Animator anim;
    public GameObject axe, unEquipted, cam,gotchaEffect,trailEffect,gotchaPos;
    public Rigidbody axeRb;
    public Vector3 des;
    public Transform curvePos, handPos, axeHandPos;
    public float throwPower;
    public float gotchaCooldown_part = 1f;
    //private
    private Vector3 pullPos;
    private bool equip, visable, moreWeight, pulling, hasWeapon, attackCoolDown, dubbelclick, clickResetOn, isTrowing;
    private float returnTime, speed, runningSpeed;
    private int clickCount;
    private void Start()//gets here everythink and sets everythink on false or true 
    {
        axe.GetComponent<ParticleSystem>().Stop();
        gotchaEffect.GetComponent<ParticleSystem>().Stop();
        hasWeapon = true;
        equip = true;
        visable = true;
        des = new Vector3(0, 0, 0);
        speed = pm.speed;
        runningSpeed = pm.runningSpeed;
        trailEffect.SetActive(false);
        Cursor.lockState = CursorLockMode.Locked;
    }
    private void Update()
    {
        InputUpdate();
        AxeUpdate();
    }
    public void InputUpdate()///lots of input
    {
        if (im.leftClick)
        {
            clickCount++;
            Invoke("ResetClickCount", 1);
            if (!clickResetOn)
            {
                Invoke("ResetClickCount", 0.4f);
                clickResetOn = true;
            }
        }
        if (clickCount >= 2)
        {
            dubbelclick = true;
        }
        else if (clickCount < 2)
        {
            dubbelclick = false;
        }
        if (dubbelclick && !attackCoolDown && hasWeapon&&equip)
        {
            AttackSpin();
        }
        if (im.leftClick&& !attackCoolDown&&!dubbelclick&&hasWeapon&&!im.rightClick && equip)
        {
            NormalAttack();
        }
        if (im.spacebar && !attackCoolDown)
        {
            Kick();
        }
        if (im.taunt)
        {
            Taunt();
        }
        if (im.equip&& hasWeapon&&!attackCoolDown)
        {
            anim.SetLayerWeight(1, 1);
            if (!equip)
            {
                Equip();
            }
            else if (equip)
            {
                Dequip();
            }
        }
        if (!hasWeapon && im.leftClick && !pulling)
        {
            if (equip)
            {
                anim.SetBool("IsRetrieving", true);
                Pull();
                isTrowing = false;
            }
        }
        if (im.rightClick)
        {
            if (equip)
            {
                ChargingAxe();
                if (!moreWeight)
                {
                    anim.SetLayerWeight(1, 0.75f);
                }
            }
        }
        else
        {
            anim.SetBool("IsCharging", false);
        }
    }


    //axe functions
    public void AxeUpdate()//is for pulling
    {
        if (pulling)
        {
            if (returnTime < 1)
            {
                axe.transform.position = GetQuadraticCurvePoint(returnTime, pullPos, curvePos.position, handPos.position);
                returnTime += Time.deltaTime * 1.5f;
            }
            else
            {
                TurnOffTrowingBool();
                hasWeapon = true;
                pulling = false;
                StartCoroutine("Gotcha");
            }
        }
    }
    IEnumerator Gotcha()//caught function
    {
        anim.SetBool("isCatching", true);
        Instantiate(gotchaEffect, gotchaPos.transform.position, Quaternion.identity,axe.transform);
        returnTime = 0;
        axe.GetComponent<AxeController>().activated = false;
        trailEffect.SetActive(false);
        axe.transform.parent = handPos;
        axe.transform.position = axeHandPos.position;
        axe.transform.rotation = axeHandPos.rotation;
        pulling = false;

        inpulseSource.GenerateImpulse(Vector3.right);
        yield return new WaitForSeconds(0.1f);
        anim.SetBool("isCatching", false);
        yield return new WaitForSeconds(gotchaCooldown_part);
        gotchaEffect.GetComponent<ParticleSystem>().IsAlive(false);
        gotchaEffect.GetComponent<ParticleSystem>().Stop();
    }
    public void TurnOffTrowingBool()//reset axe animation bools
    {
        anim.SetBool("IsTrowing", false);
        anim.SetBool("IsCharging", false);
        anim.SetBool("IsRetrieving", false);
        anim.SetBool("isCatching", false);
    }
    public void TrowAxe()//axe trow function = called with a animation event
    {
        moreWeight = false;
        if (visable && equip)
        {
            hasWeapon = false;
            axe.GetComponent<AxeController>().activated = true;
            trailEffect.SetActive(true);
            axeRb.isKinematic = false;
            axeRb.collisionDetectionMode = CollisionDetectionMode.Continuous;
            axe.transform.parent = null;
            axe.transform.eulerAngles = new Vector3(0, -90 + transform.eulerAngles.y, 0);
            axe.transform.position += transform.right / 5;
            axeRb.AddForce(cam.transform.forward * throwPower + transform.up * 4, ForceMode.Impulse);
        }
    }
    public void Pull()//pulling function more in AxeUpdate
    {
        pullPos = axe.transform.position;
        axeRb.Sleep();
        axeRb.collisionDetectionMode = CollisionDetectionMode.ContinuousSpeculative;
        axeRb.isKinematic = true;
        axe.transform.DORotate(new Vector3(-90, -90, 0), .2f).SetEase(Ease.InOutSine);
        axe.transform.DOBlendableLocalRotateBy(Vector3.right * 90, .5f);
        axe.GetComponent<AxeController>().activated = true;
        trailEffect.SetActive(true);
        pulling = true;      
    }
    public void ChargingAxe()//charge animation
    {
        isTrowing = true;
        anim.SetBool("IsCharging", true);
        if (im.rightClick && im.leftClick&&!attackCoolDown)
        {
            moreWeight = true;
            anim.SetLayerWeight(1, 1);
            RelasingAxe();
        }
    }
    //releasing~retrieving
    public void RelasingAxe()
    {
        anim.SetBool("IsTrowing", true);
    }
    public void RetrievingAxe()
    {
        anim.SetBool("IsRetrieving", true);
    }

    //equipmentfunctions
    public void Equip()//equip anims 
    {
        if (hasWeapon && !isTrowing)
        {
            equip = true;
            anim.SetBool("isUniQuiping", false);
            anim.SetBool("IsEquipt", true);
        }
    }
    public void Dequip()//dequip anims 
    {
        if (hasWeapon&&!isTrowing)
        {
            equip = false;
            anim.SetBool("IsEquipt", false);
            anim.SetBool("isUniQuiping", true);
        }
    }
    public void EquipmentOn()//turns equipment off
    {
        unEquipted.SetActive(false);
        axe.SetActive(true);
        anim.SetBool("IsEquipt", false);
        visable = true;
        axe.GetComponent<ParticleSystem>().Stop();
    }
    public void EquipmentOff()//turns equipment on
    {
        axe.SetActive(false);
        unEquipted.SetActive(true);
        anim.SetBool("isUniQuiping", false);
        visable = false;
    }

    //attack functions
    public void AttackSpin()//dubbelclick attack (spinning attack)
    {
        AnimReset();
        attackCoolDown = true;
        anim.SetBool("Is360", true);
        Invoke("AnimReset", 2);
        Invoke("AttackCooldown", 2);
    }
    public void Kick()//kick
    {
        attackCoolDown = true;
        pm.speed=0;
        pm.runningSpeed=0;
        anim.SetBool("IsKicking", true);
        Invoke("AnimReset", 1);
        Invoke("Resset", 1);
        Invoke("AttackCooldown", 1);
    }
    public void NormalAttack()//normal attack 
    {
        attackCoolDown = true;
        anim.SetBool("IsAttacking", true);
        Invoke("AnimReset", 2.2f);
        Invoke("AttackCooldown", 2.2f);
    }

    public void Taunt()//taunt function
    {
     anim.SetBool("IsTaunting", true);
     Invoke("AnimReset", 2.8f);
    }

    //reset functions
    public void AnimReset()//reset animations
    {
        anim.SetBool("IsTaunting", false);
        anim.SetBool("IsKicking", false);
        anim.SetBool("Is360", false);
        anim.SetBool("IsAttacking", false);
    }
    public void Resset()//reset for speed afther attack
    {
        pm.speed = speed;
        pm.runningSpeed = runningSpeed;
    }
    public void AttackCooldown()//cooldown for attack
    {
        attackCoolDown = false;
    }
    public void ResetClickCount()//a reset for dubbelclick
    {
        clickCount = 0;
    }

    //curve
    public Vector3 GetQuadraticCurvePoint(float t, Vector3 p0, Vector3 p1, Vector3 p2)//creates curve from the 3 vectors
    {
        float u = 1 - t;
        float tt = t * t;
        float uu = u * u;
        return (uu * p0) + (2 * u * t * p1) + (tt * p2);
    }
}