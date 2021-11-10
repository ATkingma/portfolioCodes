using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public class AI : MonoBehaviour
{
	//public
    [Header("Pathfinding")]
    public AStar pathfinding;
    public GameObject target;
    public List<Vector3> waypoints = new List<Vector3>();
	[Range(0,10)]
	public int minimalWayPointCount=3;
    public float distanceForNextWaypoint;
    public float pathUpdateTime;
    [Header("Movement")]
    public float moveSpeed;
    public float rotateSpeed;
	//private
    private float time;
    private int waypointcount;
	private void Start()
	{
		pathfinding = FindObjectOfType<AStar>();
		waypointcount = minimalWayPointCount;
	}
	void Update()
    {
		time -= Time.deltaTime;
        if(time < 0)
        {
            NewPath();
			time = pathUpdateTime;
        }
        if (waypointcount < waypoints.Count)
        {
            ManageWaypoints();
			if (waypointcount < waypoints.Count)
			{
				Move();
			}
        }
    }
	#region make path
    void ManageWaypoints()
    {
        if(Vector3.Distance(new Vector3(transform.position.x , transform.position.y, transform.position.z), new Vector3 (waypoints[waypointcount].x, transform.position.y, waypoints[waypointcount].z)) < distanceForNextWaypoint)
        {
			waypointcount++;
        }
    }
	void NewPath()
    {
		if (target == null)
		{
			return;
		}
        waypoints = new List<Vector3>();
        pathfinding.Pathfind(target.transform, transform);
        waypointcount = minimalWayPointCount;
	}
	#endregion
	#region movement
    void RotateTowards(Vector3 target)
    {
        transform.rotation = Quaternion.LookRotation(Vector3.RotateTowards(transform.forward, target - transform.position, rotateSpeed * Time.deltaTime, 0.0f));
    }
	void Move()
    {
        RotateTowards(waypoints[waypointcount]);
        transform.Translate(0, 0, moveSpeed * Time.deltaTime);
    }
	#endregion
}