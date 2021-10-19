using UnityEngine;
using UnityEditor;
using UnityEngine.SceneManagement;
using UnityEditor.SceneManagement;

[InitializeOnLoad]
[CustomEditor(typeof(PlayerPrefChanger))]
public class PlayerPrefChanger : EditorWindow
{
    public enum TypePref
    {
        Float = 0,
        Int = 1,
        String = 2,
    }
    private static string playerPrefName;
    private static float float_;
    private static int int_;
	private static string string_;
    private static bool console;
    public TypePref tP;
    [MenuItem("Tools/Prefab Editor")]
    static void MenuItem()
    {
        PlayerPrefChanger window = (PlayerPrefChanger)GetWindowWithRect(
          typeof(PlayerPrefChanger), new Rect(0, 0, 160, 60));
        window.Show();
    }
    #region UI
    void OnGUI()
    {
        tP = (TypePref)EditorGUILayout.EnumPopup("Primitive to create:", tP);
        console = GUI.Toggle(new Rect(550, 90, 100, 30), console, "Console");
        playerPrefName = EditorGUILayout.TextField("Name of PlayerPref", playerPrefName);
        if (GUI.Button(new Rect(10, 90, 200, 25), "Change PlayerPref"))
        {
            InstantiatePrimitive();
        }
        if (GUI.Button(new Rect(250, 90, 200, 25), "Reset Values"))
        {
            float_ = 0;
            int_ = 0;
            string_ = null;
			playerPrefName = null;
            Debug.Log("Resetted Values");
        }
        if (GUI.Button(new Rect(10, 120, 600, 30), "Clear all PlayerPrefs"))
        {
            PlayerPrefs.DeleteAll();
			if (console)
			{
                Debug.Log("Cleared al PlayerPrefs");
			}
        }
        switch (tP)
        {
            case TypePref.Float:
                float_ = EditorGUILayout.FloatField("Float", float_);
                break;
            case TypePref.Int:
                int_ = EditorGUILayout.IntField("Int", int_);
                break;
            case TypePref.String:
                string_ = EditorGUILayout.TextField("String", string_);
                break;
            default:
                Debug.LogError("Unrecognized Option");
                break;
        }
    }
	#endregion
	#region save pref
	void InstantiatePrimitive()
    {
        switch (tP)
        {
            case TypePref.Float:
                PlayerPrefs.SetFloat(playerPrefName, float_);
                if (console)
                {
                    Debug.Log("Changed " + playerPrefName + " To " + float_);
                }
                break;
            case TypePref.Int:
                PlayerPrefs.SetInt(playerPrefName, int_);
                if (console)
                {
                    Debug.Log("Changed " + playerPrefName + " To " + int_);
                }
                break;
            case TypePref.String:
                PlayerPrefs.SetString(playerPrefName, string_);
				if (console)
				{
                    Debug.Log("Changed "+playerPrefName+ " To " + string_);
				}
                break;
            default:
                Debug.LogError("Unrecognized Option");
                break;
        }
    }
    #endregion
}