using System.Collections;
using System.Collections.Generic;
using UnityEngine;

using BehaviorTree;

public class CheckEnemyInFOVRange : Node
{
    private LayerMask _targetLayer;

    private Transform _transform;
    private Animator _animator;

    public CheckEnemyInFOVRange(Transform transform, LayerMask targetLayer)
    {
        _transform = transform;
        _animator = transform.GetComponent<Animator>();
        _targetLayer = targetLayer;
    }

    public override NodeState Evaluate()
    {
        object t = GetData("target");
        if (t == null)
        {
            Collider[] colliders = Physics.OverlapSphere(
                _transform.position, GuardBT.fovRange, _targetLayer);

            if (colliders.Length > 0)
            {
                parent.parent.SetData("target", colliders[0].transform);
                _animator.SetBool("Walking", true);
                state = NodeState.succes;
                return state;
            }

            state = NodeState.failure;
            return state;
		}

		state = NodeState.succes;
        return state;
    }

}
