using System.Collections.Generic;
using BehaviorTree;

public class GuardBT : Tree
{
    public UnityEngine.Transform[] waypoints;

    public static float fovRange = 6f;
    public static float attackRange = 5;
    public UnityEngine.LayerMask targetLayer;

	protected override Node SetupTree()
    {
        Node root = new Selector(new List<Node>
        {
			new Sequence(new List<Node>
			{
				new CheckEnemyInAttackRange(transform),
				new TaskAttack(transform),
			}),
			new Sequence(new List<Node>
            {
                new CheckEnemyInFOVRange(transform,targetLayer),
                new TaskGoToTarget(transform),
            }),
            new TaskPatrol(transform, waypoints),
        });

        return root;
    }
}
