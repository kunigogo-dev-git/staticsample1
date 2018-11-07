using System;
using System.Threading;
using System.Reflection;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Net;
using System.Text;
using System.CodeDom;
using System.CodeDom.Compiler;
using Microsoft.CSharp;
using System.Configuration;
using System.Diagnostics;
using System.Runtime.Serialization.Formatters.Binary;

class Program
{
    static void Main(string[] args)
    {
        try
        {
            CSHttpServer();
        }
        catch(Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
    static void CSHttpServer()
    {
        // ドキュメントルート (プロジェクトディレクトリ内 wwwroot)
        // 例: "C:\Projects\CsharpHttpServerSample\wwwroot"
        string apppath = Path.GetDirectoryName(@Process.GetCurrentProcess().MainModule.FileName);
        string wwwroot = Path.Combine(apppath, "project");

        HttpListener listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:8080/");
        listener.Start();

        while (true)
        {
            HttpListenerContext context = listener.GetContext();
            HttpListenerRequest req = context.Request;
            HttpListenerResponse res = context.Response;

            // URL (ここには "/" とか "/index.html" 等が入ってくる)
            string urlPath = req.RawUrl;
            Console.WriteLine(urlPath);
            if (urlPath == "/") urlPath = "/index.html";

            // 実際のローカルファイルパス
            string path = wwwroot + urlPath.Replace("/", "\\");

            // ファイル内容を出力
            try
            {
                res.StatusCode = 200;
                byte[] content = File.ReadAllBytes(path);
                res.OutputStream.Write(content, 0, content.Length);
            }
            catch (Exception ex)
            {
                res.StatusCode = 500; // 404 でも良いのだがここは雑に 500 にまとめておく
                byte[] content = Encoding.UTF8.GetBytes(ex.Message);
                res.OutputStream.Write(content, 0, content.Length);
            }
            res.Close();
        }
    }
}