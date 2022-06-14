using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Health : MonoBehaviour
{
	public float health;
	public bool isDeath;

	public void DoDamage(float damage)
	{
		health -= damage;
		if (health <= 0)
		{
			isDeath = true;
			StartCoroutine(Death());
		}
	}
	public IEnumerator Death()
	{
		transform.GetComponent<BoxCollider>().enabled = false;
		transform.GetComponent<Animator>().SetBool("isDead", true);
		yield return new WaitForSeconds(1.5f);
		Destroy(gameObject);
	}
}
