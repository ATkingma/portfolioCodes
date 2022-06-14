using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
using BehaviorTree;

public class TaskAttack : Node
{
    private Animator _animator;
    private Transform _transform;
    private Transform _lastTarget;
    private Health _enemyManager;
    private NavMeshAgent _agent;


    private float _attackTime = 1f;
    private float _attackCounter = 0f;

    public TaskAttack(Transform transform)
    {
        _transform = transform;
        _animator = transform.GetComponent<Animator>();
        _agent = transform.GetComponent<NavMeshAgent>();
    }

    public override NodeState Evaluate()
    {
        Transform target = (Transform)GetData("target");
        _agent.destination = _transform.position;
        if (target != _lastTarget)
        {
            _enemyManager = target.GetComponent<Health>();
            _lastTarget = target;
        }

        _attackCounter += Time.deltaTime;
        if (_attackCounter >= _attackTime)
        {
            _enemyManager.DoDamage(25);
            if (_enemyManager.isDeath)
            {
                ClearData("target");
                _animator.SetBool("Attacking", false);
                _animator.SetBool("Walking", true);
            }
            else
            {
                _attackCounter = 0f;
            }
        }

        state = NodeState.running;
        return state;
    }

}
