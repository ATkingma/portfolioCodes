using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using BehaviorTree;

public class TaskGoToTarget : Node
{
    private Transform _transform;
    private NavMeshAgent _agent;

    public TaskGoToTarget(Transform transform)
    {
        _transform = transform;
        _agent = transform.GetComponent<NavMeshAgent>();
    }

    public override NodeState Evaluate()
    {
        Transform target = (Transform)GetData("target");

        if (Vector3.Distance(_transform.position, target.position) > 0.01f)
        {
            _agent.destination = target.position;
        }

        state = NodeState.running;
        return state;
    }

}
