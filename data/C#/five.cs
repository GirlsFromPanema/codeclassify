using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using TMPro;

public class SelectMove : MonoBehaviour
{
    public Material highlightMaterial;
    public Material selectionMaterial;
    public GameObject inputPosXGameObj;
    public GameObject inputPosYGameObj;
    public GameObject inputPosZGameObj;

    private Material originalMaterial;
    private Transform highlight;
    private Transform selectedTransform;
    private RaycastHit raycastHit;
    private TMP_InputField inputPosX;
    private TMP_InputField inputPosY;
    private TMP_InputField inputPosZ;
    private float posX;
    private float posY;
    private float posZ;


    private void Start()
    {
        // Get InputField components from the GameObjects
        inputPosX = inputPosXGameObj.GetComponent<TMP_InputField>();
        inputPosY = inputPosYGameObj.GetComponent<TMP_InputField>();
        inputPosZ = inputPosZGameObj.GetComponent<TMP_InputField>();
    }
}